import { ref, shallowRef, triggerRef } from '@mini-fc/core';

import type {
  Router,
  RouterOptions,
  RouteMatch,
  Route,
  NavigationGuard,
  NavigationHook
} from './types.js';
import { matchRoute } from './route.js';

// 当前路由实例（用于 RouterView 访问）
let currentRouter: RouterInstance | null = null;

export interface RouterInstance extends Router {
  _currentRoute: ReturnType<typeof shallowRef<RouteMatch | null>>;
  _resolveComponent: (route: Route) => Promise<Component | null>;
}

import type { Component } from '@mini-fc/core';

export function createRouter(options: RouterOptions): RouterInstance {
  const { routes, base = '', mode = 'hash' } = options;
  const _currentRoute = shallowRef<RouteMatch | null>(null);
  const beforeGuards: NavigationGuard[] = [];
  const afterHooks: NavigationHook[] = [];
  let isNavigating = false;

  function resolvePath(path: string): string {
    if (mode === 'hash') {
      return base ? `#${base}${path}` : `#${path}`;
    }
    return base ? `${base}${path}` : path;
  }

  function getCurrentPath(): string {
    if (mode === 'hash') {
      const hash = window.location.hash;
      return hash ? hash.slice(1) : '/';
    }
    return window.location.pathname + window.location.search;
  }

  async function resolveComponent(route: Route): Promise<Component | null> {
    if (typeof route.component === 'function') {
      // 异步组件
      try {
        const module = await (
          route.component as () => Promise<{ default: Component } | Component>
        )();
        return (module as { default: Component }).default || module;
      } catch (error) {
        console.error('Failed to load component:', error);
        return null;
      }
    }
    return route.component;
  }

  async function navigate(path: string, replace = false): Promise<boolean> {
    if (isNavigating) return false;
    isNavigating = true;

    try {
      const match = matchRoute(path, routes);
      if (!match) {
        console.warn(`[router] No route matched for path: ${path}`);
        return false;
      }

      const from = _currentRoute.value;

      // 执行 before 守卫
      for (const guard of beforeGuards) {
        const canNavigate = await guard(match, from);
        if (!canNavigate) {
          return false;
        }
      }

      _currentRoute.value = match;
      triggerRef(_currentRoute);

      // 更新 URL
      const url = resolvePath(path);
      if (mode === 'hash') {
        if (replace) {
          window.location.replace(url);
        } else {
          window.location.hash = url.slice(1); // 去掉 #
        }
      } else {
        if (replace) {
          window.history.replaceState({}, '', url);
        } else {
          window.history.pushState({}, '', url);
        }
      }

      // 执行 after 钩子
      for (const hook of afterHooks) {
        hook(match, from);
      }

      return true;
    } finally {
      isNavigating = false;
    }
  }

  const router: RouterInstance = {
    _currentRoute,
    _resolveComponent: resolveComponent,

    get currentRoute() {
      return _currentRoute.value;
    },

    push(path: string): void {
      void navigate(path);
    },

    replace(path: string): void {
      void navigate(path, true);
    },

    back(): void {
      if (mode === 'hash') {
        window.history.back();
      } else {
        window.history.back();
      }
    },

    forward(): void {
      window.history.forward();
    },

    go(delta: number): void {
      window.history.go(delta);
    },

    beforeEach(guard: NavigationGuard): () => void {
      beforeGuards.push(guard);
      return () => {
        const index = beforeGuards.indexOf(guard);
        if (index > -1) {
          beforeGuards.splice(index, 1);
        }
      };
    },

    afterEach(hook: NavigationHook): () => void {
      afterHooks.push(hook);
      return () => {
        const index = afterHooks.indexOf(hook);
        if (index > -1) {
          afterHooks.splice(index, 1);
        }
      };
    }
  };

  // 设置当前路由实例
  currentRouter = router;

  // 监听路由变化
  if (typeof window !== 'undefined') {
    if (mode === 'hash') {
      // Hash 模式监听 hashchange
      window.addEventListener('hashchange', () => {
        const path = getCurrentPath();
        void navigate(path, true);
      });
    } else {
      // History 模式监听 popstate
      window.addEventListener('popstate', () => {
        const path = getCurrentPath();
        void navigate(path, true);
      });
    }

    // 初始化路由
    const initialPath = getCurrentPath();
    void navigate(initialPath, true);
  }

  return router;
}

// 获取当前路由实例
export function getCurrentRouter(): RouterInstance | null {
  return currentRouter;
}

// 解析路径参数
export function resolveRoutePath(path: string, params: Record<string, string>): string {
  return path.replace(/:(\w+)/g, (_, key) => params[key] || '');
}
