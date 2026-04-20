import { defineComponent, h, ref } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

export type ButtonType = 'primary' | 'default' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export const Button = defineComponent<{
  type: { type: typeof String; default: 'default' };
  size: { type: typeof String; default: 'medium' };
  disabled: { type: typeof Boolean; default: false };
  loading: { type: typeof Boolean; default: false };
}>({
  name: 'Button',
  props: {
    type: { type: String, default: 'default' },
    size: { type: String, default: 'medium' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const isPressed = ref(false);

    const handleClick = (event: MouseEvent): void => {
      if (props.disabled || props.loading) return;
      emit('click', event);
    };

    const handleMouseDown = (): void => {
      if (!props.disabled && !props.loading) {
        isPressed.value = true;
      }
    };

    const handleMouseUp = (): void => {
      isPressed.value = false;
    };

    return (): VNode => {
      const classNames = [
        'mf-button',
        `mf-button--${props.type}`,
        `mf-button--${props.size}`,
        props.disabled ? 'mf-button--disabled' : '',
        props.loading ? 'mf-button--loading' : '',
        isPressed.value ? 'mf-button--pressed' : ''
      ].filter(Boolean).join(' ');

      return h('button', {
        class: classNames,
        disabled: props.disabled || props.loading,
        'aria-disabled': props.disabled || props.loading,
        onClick: handleClick,
        onMousedown: handleMouseDown,
        onMouseup: handleMouseUp,
        onMouseleave: handleMouseUp
      }, [
        props.loading ? h('span', { class: 'mf-button__loading-icon mf-animate-spin' }, '⟳') : null,
        h('span', { class: 'mf-button__content' }, '默认内容')
      ]);
    };
  }
});

export default Button;
