export interface Component {
  id: string;
  name: string;
  render(): VNode;
  mount(container: HTMLElement): void;
  unmount(): void;
  update(props: Record<string, unknown>): void;
}

export interface VNode {
  type: string | Component | null;
  props: Record<string, unknown>;
  children: (VNode | string)[];
  key?: string | number;
  el?: HTMLElement | Text;
}

export interface ComponentOptions {
  name: string;
  setup(props: Record<string, unknown>, ctx: SetupContext): unknown;
  render(ctx: unknown): VNode;
}

export interface SetupContext {
  emit: (event: string, ...args: unknown[]) => void;
  slots: Record<string, () => VNode[]>;
}

export type Ref<T> = { value: T };

export type Reactive<T extends object> = T;
