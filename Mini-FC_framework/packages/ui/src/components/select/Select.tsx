import { defineComponent, h, ref, computed } from '@mini-fc/core';
import type { VNode } from '@mini-fc/core';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  modelValue?: string | number;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = defineComponent<{
  modelValue: { type: (StringConstructor | NumberConstructor)[]; default: undefined };
  options: { type: typeof Array; default: () => [] };
  placeholder: { type: typeof String; default: '请选择' };
}>({
  name: 'Select',
  props: {
    modelValue: { type: [String, Number], default: undefined },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: '请选择' }
  },
  setup(props, { emit }) {
    const isOpen = ref(false);
    const selectRef = ref<HTMLDivElement | null>(null);

    const selectedLabel = computed(() => {
      const selected = props.options.find(opt => opt.value === props.modelValue);
      return selected?.label ?? '';
    });

    const handleToggle = (): void => {
      isOpen.value = !isOpen.value;
    };

    const handleSelect = (option: SelectOption): void => {
      emit('update:modelValue', option.value);
      emit('change', option.value);
      isOpen.value = false;
    };

    const handleClickOutside = (event: MouseEvent): void => {
      if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };

    // 添加全局点击监听
    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
    }

    return (): VNode => {
      const classNames = ['mf-select', isOpen.value ? 'mf-select--open' : '']
        .filter(Boolean)
        .join(' ');

      return h('div', { class: classNames, ref: selectRef }, [
        h(
          'div',
          {
            class: 'mf-select__trigger',
            onClick: handleToggle
          },
          [
            h(
              'span',
              {
                class: selectedLabel.value ? 'mf-select__value' : 'mf-select__placeholder'
              },
              selectedLabel.value || props.placeholder
            ),
            h('span', { class: 'mf-select__arrow' }, '▼')
          ]
        ),
        isOpen.value
          ? h('div', { class: 'mf-select__dropdown mf-animate-slide-up' }, [
              h(
                'ul',
                { class: 'mf-select__list' },
                (props.options as SelectOption[]).map(option =>
                  h(
                    'li',
                    {
                      class: [
                        'mf-select__option',
                        option.value === props.modelValue ? 'mf-select__option--selected' : ''
                      ].join(' '),
                      onClick: () => handleSelect(option)
                    },
                    option.label
                  )
                )
              )
            ])
          : null
      ]);
    };
  }
});

export default Select;
