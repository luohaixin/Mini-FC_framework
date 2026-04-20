import { defineComponent, h, ref, computed } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

export type InputType = 'text' | 'password';

export interface InputProps {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: InputType;
  clearable?: boolean;
}

export const Input = defineComponent<{
  modelValue: { type: typeof String; default: '' };
  placeholder: { type: typeof String; default: '' };
  disabled: { type: typeof Boolean; default: false };
  type: { type: typeof String; default: 'text' };
  clearable: { type: typeof Boolean; default: false };
}>({
  name: 'Input',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
    clearable: { type: Boolean, default: false }
  },
  setup(props, { emit }) {
    const isFocused = ref(false);
    const inputRef = ref<HTMLInputElement | null>(null);

    const showClear = computed(() => {
      return props.clearable && props.modelValue && !props.disabled;
    });

    const handleInput = (event: Event): void => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    const handleFocus = (event: FocusEvent): void => {
      isFocused.value = true;
      emit('focus', event);
    };

    const handleBlur = (event: FocusEvent): void => {
      isFocused.value = false;
      emit('blur', event);
    };

    const handleClear = (): void => {
      emit('update:modelValue', '');
      inputRef.value?.focus();
    };

    return (): VNode => {
      const classNames = [
        'mf-input',
        props.disabled ? 'mf-input--disabled' : '',
        isFocused.value ? 'mf-input--focused' : ''
      ].filter(Boolean).join(' ');

      return h('div', { class: classNames }, [
        h('input', {
          ref: inputRef,
          class: 'mf-input__field',
          type: props.type,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          'aria-disabled': props.disabled,
          onInput: handleInput,
          onFocus: handleFocus,
          onBlur: handleBlur
        }),
        showClear.value
          ? h('span', {
              class: 'mf-input__clear',
              onClick: handleClear
            }, '✕')
          : null
      ]);
    };
  }
});

export default Input;
