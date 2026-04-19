import { defineComponent, h, ref } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

export type SwitchSize = 'small' | 'medium' | 'large';

export interface SwitchProps {
  modelValue?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
}

export const Switch = defineComponent<{
  modelValue: { type: typeof Boolean; default: false };
  disabled: { type: typeof Boolean; default: false };
  size: { type: typeof String; default: 'medium' };
}>({
  name: 'Switch',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: 'medium' }
  },
  setup(props, { emit }) {
    const handleClick = (): void => {
      if (props.disabled) return;
      emit('update:modelValue', !props.modelValue);
    };

    return (): VNode => {
      const classNames = [
        'mf-switch',
        `mf-switch--${props.size}`,
        props.modelValue ? 'mf-switch--checked' : '',
        props.disabled ? 'mf-switch--disabled' : ''
      ].filter(Boolean).join(' ');

      return h('button', {
        class: classNames,
        type: 'button',
        role: 'switch',
        'aria-checked': String(props.modelValue),
        'aria-disabled': props.disabled,
        disabled: props.disabled,
        onClick: handleClick
      }, [
        h('span', { class: 'mf-switch__handle' })
      ]);
    };
  }
});

export default Switch;
