import { defineComponent, h } from '@mini-fc/core';
import type { VNode } from '@mini-fc/core';

export interface LoadingProps {
  visible?: boolean;
  text?: string;
  fullscreen?: boolean;
}

export const Loading = defineComponent<{
  visible: { type: typeof Boolean; default: false };
  text: { type: typeof String; default: '加载中...' };
  fullscreen: { type: typeof Boolean; default: false };
}>({
  name: 'Loading',
  props: {
    visible: { type: Boolean, default: false },
    text: { type: String, default: '加载中...' },
    fullscreen: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    return (): VNode | null => {
      if (!props.visible) {
        return slots.default?.() ?? null;
      }

      const classNames = [
        'mf-loading',
        props.fullscreen ? 'mf-loading--fullscreen' : 'mf-loading--local'
      ]
        .filter(Boolean)
        .join(' ');

      const spinner = h('div', { class: classNames }, [
        h('div', { class: 'mf-loading__mask' }),
        h('div', { class: 'mf-loading__content' }, [
          h('span', { class: 'mf-loading__spinner mf-animate-spin' }, '⟳'),
          props.text ? h('span', { class: 'mf-loading__text' }, props.text) : null
        ])
      ]);

      if (props.fullscreen) {
        return spinner;
      }

      // 局部遮罩模式
      return h('div', { class: 'mf-loading-wrapper' }, [slots.default?.() ?? [], spinner]);
    };
  }
});

export default Loading;
