import type { Component, ComponentOptions, VNode } from './types.js';

let componentId = 0;

export function createComponent(options: ComponentOptions): Component {
  const id = `component-${++componentId}`;
  let isMounted = false;
  let container: HTMLElement | null = null;
  let currentProps: Record<string, unknown> = {};
  let setupContext: unknown;

  const component: Component = {
    id,
    name: options.name,
    render(): VNode {
      return options.render(setupContext);
    },
    mount(target: HTMLElement): void {
      if (isMounted) {
        throw new Error(`Component ${options.name} is already mounted`);
      }
      container = target;
      setupContext = options.setup(currentProps, {
        emit: () => {},
        slots: {}
      });
      isMounted = true;
    },
    unmount(): void {
      if (!isMounted) {
        throw new Error(`Component ${options.name} is not mounted`);
      }
      container = null;
      isMounted = false;
    },
    update(props: Record<string, unknown>): void {
      currentProps = { ...currentProps, ...props };
      if (isMounted && container) {
        setupContext = options.setup(currentProps, {
          emit: () => {},
          slots: {}
        });
      }
    }
  };

  return component;
}
