import { defineComponent, h, ref } from '@my-framework/core';
import type { VNode } from '@my-framework/core';

export interface ModalProps {
  visible?: boolean;
  title?: string;
  width?: string | number;
  closable?: boolean;
  maskClosable?: boolean;
}

export const Modal = defineComponent<{
  visible: { type: typeof Boolean; default: false };
  title: { type: typeof String; default: '' };
  width: { type: (StringConstructor | NumberConstructor)[]; default: 520 };
  closable: { type: typeof Boolean; default: true };
  maskClosable: { type: typeof Boolean; default: true };
}>({
  name: 'Modal',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: [String, Number], default: 520 },
    closable: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true }
  },
  setup(props, { emit, slots }) {
    const modalRef = ref<HTMLDivElement | null>(null);

    const handleClose = (): void => {
      emit('update:visible', false);
      emit('close');
    };

    const handleMaskClick = (): void => {
      if (props.maskClosable) {
        handleClose();
      }
    };

    const handleConfirm = (): void => {
      emit('confirm');
    };

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && props.visible) {
        handleClose();
      }
    };

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown);
    });

    return (): VNode | null => {
      if (!props.visible) return null;

      const widthStyle = typeof props.width === 'number' 
        ? `${props.width}px` 
        : props.width;

      return h('div', { class: 'mf-modal-root' }, [
        h('div', {
          class: 'mf-modal-mask mf-animate-fade-in',
          onClick: handleMaskClick
        }),
        h('div', {
          class: 'mf-modal-wrap',
          ref: modalRef
        }, [
          h('div', {
            class: 'mf-modal mf-animate-slide-up',
            style: { width: widthStyle }
          }, [
            h('div', { class: 'mf-modal__header' }, [
              h('div', { class: 'mf-modal__title' }, props.title),
              props.closable
                ? h('button', {
                    class: 'mf-modal__close',
                    onClick: handleClose
                  }, '✕')
                : null
            ]),
            h('div', { class: 'mf-modal__body' }, slots.default?.() ?? []),
            h('div', { class: 'mf-modal__footer' }, [
              h('button', {
                class: 'mf-modal__btn mf-modal__btn--default',
                onClick: handleClose
              }, '取消'),
              h('button', {
                class: 'mf-modal__btn mf-modal__btn--primary',
                onClick: handleConfirm
              }, '确定')
            ])
          ])
        ])
      ]);
    };
  }
});

export default Modal;
