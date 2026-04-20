import { defineComponent, h, reactive } from '@mini-fc/core';
import type { VNode } from '@mini-fc/core';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastOptions {
  message: string;
  duration?: number;
}

// 全局 toast 队列
const toastQueue = reactive<ToastItem[]>([]);

let toastId = 0;

function addToast(message: string, type: ToastType, duration = 3000): void {
  const id = `toast-${++toastId}`;
  const toast: ToastItem = {
    id,
    message,
    type,
    duration
  };

  toastQueue.push(toast);

  setTimeout(() => {
    const index = toastQueue.findIndex(t => t.id === id);
    if (index > -1) {
      toastQueue.splice(index, 1);
    }
  }, duration);
}

export const ToastAPI = {
  info(message: string, duration?: number): void {
    addToast(message, 'info', duration);
  },
  success(message: string, duration?: number): void {
    addToast(message, 'success', duration);
  },
  error(message: string, duration?: number): void {
    addToast(message, 'error', duration);
  },
  warning(message: string, duration?: number): void {
    addToast(message, 'warning', duration);
  }
};

export const ToastContainer = defineComponent({
  name: 'ToastContainer',
  setup() {
    return (): VNode => {
      return h(
        'div',
        { class: 'mf-toast-container' },
        toastQueue.map(toast =>
          h(
            'div',
            {
              class: `mf-toast mf-toast--${toast.type} mf-animate-slide-up`,
              key: toast.id
            },
            [
              h('span', { class: 'mf-toast__icon' }, getIcon(toast.type)),
              h('span', { class: 'mf-toast__message' }, toast.message)
            ]
          )
        )
      );
    };
  }
});

function getIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    default:
      return 'ℹ';
  }
}

export default ToastContainer;
