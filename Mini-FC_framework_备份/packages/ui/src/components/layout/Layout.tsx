import { defineComponent, h } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

// Layout 主容器
export const Layout = defineComponent({
  name: 'Layout',
  setup(props, { slots }) {
    return (): VNode => {
      return h('div', { class: 'mf-layout' }, slots.default?.() ?? []);
    };
  }
});

// Header
export const Header = defineComponent({
  name: 'Header',
  setup(props, { slots }) {
    return (): VNode => {
      return h('header', { class: 'mf-layout__header' }, slots.default?.() ?? []);
    };
  }
});

// Sider 侧边栏
export interface SiderProps {
  width?: string | number;
  collapsible?: boolean;
  collapsed?: boolean;
}

export const Sider = defineComponent<{
  width: { type: (StringConstructor | NumberConstructor)[]; default: 200 };
  collapsible: { type: typeof Boolean; default: false };
  collapsed: { type: typeof Boolean; default: false };
}>({
  name: 'Sider',
  props: {
    width: { type: [String, Number], default: 200 },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false }
  },
  setup(props, { emit, slots }) {
    const handleToggle = (): void => {
      emit('update:collapsed', !props.collapsed);
    };

    return (): VNode => {
      const widthStyle = props.collapsed 
        ? '80px' 
        : (typeof props.width === 'number' ? `${props.width}px` : props.width);

      const classNames = [
        'mf-layout__sider',
        props.collapsed ? 'mf-layout__sider--collapsed' : ''
      ].filter(Boolean).join(' ');

      return h('aside', { 
        class: classNames,
        style: { width: widthStyle }
      }, [
        h('div', { class: 'mf-layout__sider-content' }, slots.default?.() ?? []),
        props.collapsible
          ? h('button', {
              class: 'mf-layout__sider-trigger',
              onClick: handleToggle
            }, props.collapsed ? '→' : '←')
          : null
      ]);
    };
  }
});

// Content
export const Content = defineComponent({
  name: 'Content',
  setup(props, { slots }) {
    return (): VNode => {
      return h('main', { class: 'mf-layout__content' }, slots.default?.() ?? []);
    };
  }
});

// Footer
export const Footer = defineComponent({
  name: 'Footer',
  setup(props, { slots }) {
    return (): VNode => {
      return h('footer', { class: 'mf-layout__footer' }, slots.default?.() ?? []);
    };
  }
});

export default Layout;
