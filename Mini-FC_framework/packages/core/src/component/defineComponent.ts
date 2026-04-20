import type { ReactiveEffectRunner } from '@vue/reactivity';

import { shallowRef, triggerRef, isRef, unref, type Ref } from '../reactivity/index.js';

// DEV 标志
const __DEV__ = process.env.NODE_ENV !== 'production';

// Props 类型定义
export type PropType<T = unknown> =
  | { type: PropConstructor<T>; required?: boolean; default?: T }
  | { type: PropConstructor<T>; required: true }
  | PropConstructor<T>;

type PropConstructor<T = unknown> =
  | { new (...args: unknown[]): T & object }
  | { (...args: unknown[]): T }
  | null;

// 从 PropType 提取类型
type ExtractPropType<T extends PropType<unknown>> =
  T extends PropConstructor<infer V>
    ? V
    : T extends { type: PropConstructor<infer V>; required: true }
      ? V
      : T extends { type: PropConstructor<infer V>; default: infer D }
        ? V | D
        : T extends { type: PropConstructor<infer V> }
          ? V | undefined
          : never;

// 从 props 选项对象提取 Props 类型
export type ExtractProps<T extends Record<string, PropType<unknown>>> = {
  [K in keyof T]: ExtractPropType<T[K]>;
};

// Emit 函数类型
export type EmitFn = (event: string, ...args: unknown[]) => void;

// Slots 类型
export type Slots = Record<string, () => VNode[]>;

// Setup 上下文
export interface SetupContext {
  emit: EmitFn;
  slots: Slots;
}

// 渲染函数类型
export type RenderFn = () => VNode;

// VNode 类型定义
export interface VNode {
  type: string | Component | null;
  props: Record<string, unknown>;
  children: (VNode | string)[];
  key?: string | number;
  el?: HTMLElement | Text | null;
}

// 组件类型
export interface Component {
  name: string;
  props?: Record<string, PropType<unknown>>;
  setup: (props: Record<string, unknown>, context: SetupContext) => RenderFn | object;
}

// 组件实例
export interface ComponentInstance {
  name: string;
  props: Ref<Record<string, unknown>>;
  setupResult: RenderFn | object;
  context: SetupContext;
  isMounted: boolean;
  emit: EmitFn;
  // 自动重新渲染相关属性
  effect?: ReactiveEffectRunner<unknown>;
  subTree?: VNode | null;
  container?: HTMLElement | null;
  update?: () => void;
}

// DefineComponent 选项
export interface DefineComponentOptions<
  P extends Record<string, PropType<unknown>> = Record<string, PropType<unknown>>
> {
  name: string;
  props?: P;
  setup: (props: ExtractProps<P>, context: SetupContext) => RenderFn | object;
}

// 验证单个 prop
function validateProp(
  key: string,
  value: unknown,
  propType: PropType<unknown>,
  componentName: string
): void {
  if (!__DEV__) return;

  const type = typeof propType === 'function' ? propType : propType.type;
  const isRequired = typeof propType === 'object' && propType.required === true;
  const hasDefault = typeof propType === 'object' && 'default' in propType;

  // 检查必填
  if (isRequired && (value === undefined || value === null)) {
    console.warn(`[mini-fc warn]: Missing required prop: "${key}" in component "${componentName}"`);
    return;
  }

  // 如果值为空且有默认值，跳过类型检查
  if ((value === undefined || value === null) && hasDefault) {
    return;
  }

  // 类型检查
  if (value !== undefined && value !== null && type !== null) {
    const expectedType = type.name.toLowerCase();
    const actualType = typeof value;

    let typeMatch = false;
    if (type === String) {
      typeMatch = actualType === 'string';
    } else if (type === Number) {
      typeMatch = actualType === 'number';
    } else if (type === Boolean) {
      typeMatch = actualType === 'boolean';
    } else if (type === Function) {
      typeMatch = actualType === 'function';
    } else if (type === Object) {
      typeMatch = actualType === 'object' && !Array.isArray(value);
    } else if (type === Array) {
      typeMatch = Array.isArray(value);
    } else if (type === Symbol) {
      typeMatch = actualType === 'symbol';
    }

    if (!typeMatch) {
      console.warn(
        `[mini-fc warn]: Invalid prop: type check failed for prop "${key}" in component "${componentName}". ` +
          `Expected ${type.name}, got ${actualType === 'object' ? (Array.isArray(value) ? 'Array' : 'Object') : actualType}`
      );
    }
  }
}

// 解析 props 默认值
function resolveProps<P extends Record<string, PropType<unknown>>>(
  options: DefineComponentOptions<P>,
  rawProps: Record<string, unknown>
): ExtractProps<P> {
  const props = {} as ExtractProps<P>;
  const propOptions = options.props || {};

  for (const key in propOptions) {
    const propType = propOptions[key];
    let value = rawProps[key];

    // 应用默认值
    if ((value === undefined || value === null) && typeof propType === 'object') {
      if ('default' in propType) {
        value =
          typeof propType.default === 'function'
            ? (propType.default as () => unknown)()
            : propType.default;
      }
    }

    // 验证 prop
    validateProp(key, value, propType, options.name);

    (props as Record<string, unknown>)[key] = value;
  }

  return props;
}

// 创建 emit 函数
function createEmitFn(instance: ComponentInstance): EmitFn {
  return (event: string, ...args: unknown[]) => {
    if (__DEV__) {
      console.log(`[mini-fc emit]: Component "${instance.name}" emitted event "${event}"`, args);
    }
    // 这里可以触发父组件监听的事件
  };
}

// 创建组件实例
function createComponentInstance<P extends Record<string, PropType<unknown>>>(
  options: DefineComponentOptions<P>,
  rawProps: Record<string, unknown>
): ComponentInstance {
  const resolvedProps = resolveProps(options, rawProps);
  const props = shallowRef(resolvedProps);

  const instance: ComponentInstance = {
    name: options.name,
    props,
    setupResult: null as unknown as RenderFn | object,
    context: null as unknown as SetupContext,
    isMounted: false,
    emit: null as unknown as EmitFn
  };

  // 创建 emit 函数
  instance.emit = createEmitFn(instance);

  // 创建 setup 上下文
  instance.context = {
    emit: instance.emit,
    slots: {} as Slots
  };

  // 执行 setup
  instance.setupResult = options.setup(resolvedProps, instance.context);

  return instance;
}

// 定义组件
export function defineComponent<
  P extends Record<string, PropType<unknown>> = Record<string, never>
>(options: DefineComponentOptions<P>): Component {
  const component: Component = {
    name: options.name,
    props: options.props,
    setup: (props: Record<string, unknown>, context: SetupContext) => {
      return options.setup(props as ExtractProps<P>, context);
    }
  };

  return component;
}

// 挂载组件
export function mountComponent(
  component: Component,
  container: HTMLElement,
  props: Record<string, unknown> = {}
): ComponentInstance {
  const instance = createComponentInstance(
    { name: component.name, props: component.props, setup: component.setup },
    props
  );

  instance.isMounted = true;

  if (__DEV__) {
    console.log(`[mini-fc]: Component "${instance.name}" mounted`);
  }

  return instance;
}

// 更新组件 props
export function updateComponentProps(
  instance: ComponentInstance,
  newProps: Record<string, unknown>
): void {
  const resolvedProps = { ...unref(instance.props), ...newProps };
  instance.props.value = resolvedProps;
  triggerRef(instance.props);

  if (__DEV__) {
    console.log(`[mini-fc]: Component "${instance.name}" props updated`, resolvedProps);
  }
}

// 卸载组件
export function unmountComponent(instance: ComponentInstance): void {
  instance.isMounted = false;

  if (__DEV__) {
    console.log(`[mini-fc]: Component "${instance.name}" unmounted`);
  }
}

// 导出类型
export type { PropConstructor, Component, ComponentInstance, VNode, RenderFn, SetupContext };
