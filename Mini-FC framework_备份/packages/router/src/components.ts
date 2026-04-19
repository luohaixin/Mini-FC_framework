import { defineComponent, h, ref, watch } from '@my-framework/core';
import type { VNode, Component } from '@my-framework/core';
import { getCurrentRouter } from './router.js';
import type { RouterLinkProps } from './types.js';

// RouterView 组件 - 渲染匹配的路由组件
export const RouterView = defineComponent({
  name: 'RouterView',
  setup() {
    const router = getCurrentRouter();
    const currentComponent = ref<Component | null>(null);

    if (!router) {
      console.warn('[router] RouterView must be used within a router');
      return (): VNode | null => null;
    }

    watch(() => router._currentRoute.value, (routeMatch) => {
      console.log('[RouterView] routeMatch changed:', routeMatch);
      if (routeMatch) {
        // 同步解析组件（因为组件是同步定义的）
        const component = routeMatch.route.component;
        console.log('[RouterView] resolved component:', component);
        currentComponent.value = component as Component;
      } else {
        currentComponent.value = null;
      }
    }, { immediate: true });

    return (): VNode | null => {
      const component = currentComponent.value;
      console.log('[RouterView] rendering component:', component);
      if (!component) {
        return h('div', { class: 'router-view-empty' }, 'No matched route');
      }
      return h(component, {});
    };
  }
});

// RouterLink 组件 - 导航链接
export const RouterLink = defineComponent<{
  to: { type: (StringConstructor | ObjectConstructor)[]; required: true };
  replace: { type: typeof Boolean; default: false };
  activeClass: { type: typeof String; default: 'router-link-active' };
  exactActiveClass: { type: typeof String; default: 'router-link-exact-active' };
}>({
  name: 'RouterLink',
  props: {
    to: { type: [String, Object], required: true },
    replace: { type: Boolean, default: false },
    activeClass: { type: String, default: 'router-link-active' },
    exactActiveClass: { type: String, default: 'router-link-exact-active' }
  },
  setup(props, { slots }) {
    const router = getCurrentRouter();

    if (!router) {
      console.warn('[router] RouterLink must be used within a router');
      return (): VNode => h('a', {}, slots.default?.() ?? []);
    }

    const handleClick = (event: MouseEvent): void => {
      event.preventDefault();

      const to = props.to;
      let path: string;

      if (typeof to === 'string') {
        path = to;
      } else {
        // 对象形式 { path, name, params, query }
        const routeObj = to as { path?: string; name?: string; params?: Record<string, string>; query?: Record<string, string> };
        if (routeObj.path) {
          path = routeObj.path;
        } else {
          // TODO: 支持通过 name 查找路由
          path = '/';
        }
      }

      if (props.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    };

    const getHref = (): string => {
      const to = props.to;
      if (typeof to === 'string') {
        return to;
      }
      return (to as { path?: string }).path || '/';
    };

    const isActive = (): boolean => {
      const currentRoute = router.currentRoute;
      if (!currentRoute) return false;

      const to = props.to;
      const targetPath = typeof to === 'string' ? to : (to as { path?: string }).path || '/';

      // 移除查询参数进行比较
      const currentPath = currentRoute.route.path;
      return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    const isExactActive = (): boolean => {
      const currentRoute = router.currentRoute;
      if (!currentRoute) return false;

      const to = props.to;
      const targetPath = typeof to === 'string' ? to : (to as { path?: string }).path || '/';

      return currentRoute.route.path === targetPath;
    };

    return (): VNode => {
      const classNames = [
        'router-link',
        isActive() ? props.activeClass : '',
        isExactActive() ? props.exactActiveClass : ''
      ].filter(Boolean).join(' ');

      return h('a', {
        class: classNames,
        href: getHref(),
        onClick: handleClick
      }, slots.default?.() ?? []);
    };
  }
});
