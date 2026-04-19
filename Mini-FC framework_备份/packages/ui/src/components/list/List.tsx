import { defineComponent, h } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

export interface ListProps<T = unknown> {
  dataSource?: T[];
  bordered?: boolean;
  loading?: boolean;
  emptyText?: string;
}

export type RenderItemFn<T> = (item: T, index: number) => VNode | string | null;

export const List = defineComponent<{
  dataSource: { type: typeof Array; default: () => [] };
  bordered: { type: typeof Boolean; default: false };
  loading: { type: typeof Boolean; default: false };
  emptyText: { type: typeof String; default: '暂无数据' };
}>({
  name: 'List',
  props: {
    dataSource: { type: Array, default: () => [] },
    bordered: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' }
  },
  setup(props, { slots }) {
    return (): VNode => {
      const classNames = [
        'mf-list',
        props.bordered ? 'mf-list--bordered' : ''
      ].filter(Boolean).join(' ');

      const data = props.dataSource as unknown[];
      const isEmpty = data.length === 0;

      return h('div', { class: classNames }, [
        props.loading
          ? h('div', { class: 'mf-list__loading' }, [
              h('span', { class: 'mf-list__loading-icon mf-animate-spin' }, '⟳'),
              h('span', { class: 'mf-list__loading-text' }, '加载中...')
            ])
          : isEmpty
            ? h('div', { class: 'mf-list__empty' }, props.emptyText)
            : h('ul', { class: 'mf-list__items' },
                data.map((item, index) =>
                  h('li', {
                    class: 'mf-list__item',
                    key: index
                  }, slots.renderItem?.(item, index) ?? [])
                )
              )
      ]);
    };
  }
});

export default List;
