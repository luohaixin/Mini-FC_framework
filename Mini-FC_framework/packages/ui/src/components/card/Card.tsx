import { defineComponent, h } from '@mini-fc/core';
import type { VNode } from '@mini-fc/core';

export type CardShadow = 'always' | 'hover' | 'never';

export interface CardProps {
  title?: string;
  bordered?: boolean;
  shadow?: CardShadow;
}

export const Card = defineComponent<{
  title: { type: typeof String; default: '' };
  bordered: { type: typeof Boolean; default: true };
  shadow: { type: typeof String; default: 'always' };
}>({
  name: 'Card',
  props: {
    title: { type: String, default: '' },
    bordered: { type: Boolean, default: true },
    shadow: { type: String, default: 'always' }
  },
  setup(props, { slots }) {
    return (): VNode => {
      const classNames = [
        'mf-card',
        props.bordered ? 'mf-card--bordered' : '',
        `mf-card--shadow-${props.shadow}`
      ]
        .filter(Boolean)
        .join(' ');

      return h('div', { class: classNames }, [
        props.title || slots.header
          ? h('div', { class: 'mf-card__header' }, [
              slots.header?.() ?? h('span', { class: 'mf-card__title' }, props.title)
            ])
          : null,
        h('div', { class: 'mf-card__body' }, slots.default?.() ?? []),
        slots.footer ? h('div', { class: 'mf-card__footer' }, slots.footer()) : null
      ]);
    };
  }
});

export default Card;
