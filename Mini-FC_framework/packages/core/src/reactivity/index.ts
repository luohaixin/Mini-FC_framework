// 第1-44行：从 @vue/reactivity 导入 Vue3 的响应式 API
import {
  ref as _ref, // 创建响应式引用
  shallowRef as _shallowRef, // 浅层响应式引用
  reactive as _reactive, // 创建响应式对象
  readonly as _readonly, // 创建只读响应式对象
  shallowReactive as _shallowReactive, // 浅层响应式对象
  shallowReadonly as _shallowReadonly, // 浅层只读对象
  computed as _computed, // 计算属性
  watch as _watch, // 侦听器
  effect as _effect, // 副作用函数
  stop as _stop, // 停止 effect
  effectScope, // 作用域管理
  getCurrentScope, // 获取当前作用域
  onScopeDispose, // 作用域销毁回调
  toRaw, // 获取原始对象
  toRef, // 转为 ref
  toRefs, // 对象转为 refs
  isRef, // 检查是否为 ref
  isReactive, // 检查是否为 reactive
  isReadonly, // 检查是否为 readonly
  isProxy, // 检查是否为代理
  unref, // 解包 ref
  proxyRefs, // 代理 refs
  customRef, // 自定义 ref
  triggerRef, // 触发 shallowRef 更新
  EffectScope, // 作用域类
  // 类型导入
  type Ref as _Ref,
  type ComputedRef as _ComputedRef,
  type WritableComputedRef as _WritableComputedRef,
  type ComputedGetter,
  type ComputedSetter,
  type UnwrapRef,
  type ShallowRef,
  type ShallowUnwrapRef,
  type ReactiveFlags,
  type DeepReadonly,
  type WatchCallback,
  type WatchSource,
  type WatchStopHandle,
  type WatchOptions,
  type WatchOptionsBase,
  type OnCleanup,
  type ReactiveEffectRunner
} from '@vue/reactivity';

// 第47行：定义开发环境标志
const __DEV__ = process.env['NODE_ENV'] !== 'production';

// 第50-78行：重新定义类型接口，提供更清晰的类型定义

// Ref 接口：响应式引用
export interface Ref<T = unknown> {
  get value(): T; // getter 获取值
  set value(newValue: T); // setter 设置值
}

// ComputedRef 接口：只读计算属性
export interface ComputedRef<T = unknown> {
  readonly value: T; // 只读值
  readonly [Symbol.toStringTag]: 'ComputedRef'; // Symbol.toStringTag 用于对象类型识别
}

// WritableComputedRef 接口：可写计算属性
export interface WritableComputedRef<T> extends ComputedRef<T> {
  value: T; // 可写的 value
}

// Reactive 类型：响应式对象
export type Reactive<T extends object> = T & {
  [Symbol.observable]?: unknown; // 支持 observable 协议
};

// DeepReadonly 类型：深层只读类型
export type DeepReadonly<T> = T extends (infer U)[]
  ? DeepReadonlyArray<U> // 如果是数组，递归处理元素
  : T extends object
    ? DeepReadonlyObject<T> // 如果是对象，递归处理属性
    : T; // 基础类型保持不变

// 深层只读数组接口
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

// 深层只读对象类型
type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>; // 所有属性递归设为只读
};

// 第81-91行：nextTick 实现 - 微任务调度
export function nextTick<T = void>(fn?: () => T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      // 使用 setTimeout 模拟微任务
      if (fn) {
        resolve(fn()); // 执行回调并解析结果
      } else {
        resolve(undefined as T); // 无回调时解析 undefined
      }
    }, 0);
  });
}

// 第94-148行：序列化检查工具

// 第94-100行：定义不可序列化的类型集合
const NON_SERIALIZABLE_TYPES = new Set<string>([
  'Function', // 函数
  'Symbol', // Symbol
  'WeakMap', // WeakMap（无法遍历）
  'WeakSet', // WeakSet（无法遍历）
  'Promise' // Promise
]);

// 第102-104行：获取值的类型名称
function getType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1);
  // Object.prototype.toString.call(value) 返回 "[object TypeName]"
  // slice(8, -1) 提取 "TypeName" 部分
}

// 第106-137行：检查值是否可序列化
function isSerializable(value: unknown, seen = new WeakSet<object>()): boolean {
  // 基础类型检查
  if (value === null || typeof value !== 'object') {
    return typeof value !== 'function' && typeof value !== 'symbol';
  }

  // 循环引用检查
  if (seen.has(value)) return true; // 已检查过，认为是可序列化的
  seen.add(value); // 标记为已检查

  // 检查类型是否在不可序列化集合中
  const type = getType(value);
  if (NON_SERIALIZABLE_TYPES.has(type)) return false;

  // 数组递归检查
  if (Array.isArray(value)) {
    return value.every(item => isSerializable(item, seen));
  }

  // Map/Set 检查
  if (value instanceof Map || value instanceof Set) {
    for (const item of value) {
      if (!isSerializable(item, seen)) return false;
    }
    return true;
  }

  // 普通对象递归检查所有属性
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      if (!isSerializable((value as Record<string, unknown>)[key], seen)) {
        return false;
      }
    }
  }

  return true;
}

// 第139-148行：开发环境警告函数
function warnNonSerializable(value: unknown, context: string): void {
  if (!__DEV__) return; // 生产环境不警告
  if (!isSerializable(value)) {
    console.warn(
      `[mini-fc warn]: Non-serializable value detected in ${context}. ` +
        `This may cause issues with state persistence. ` +
        `Value type: ${getType(value)}`
    );
  }
}

// 第151-158行：ref 函数 - 创建响应式引用
export function ref<T>(value: T): Ref<UnwrapRef<T>>;
export function ref<T = undefined>(): Ref<T | undefined>;
export function ref<T>(value?: T): Ref<UnwrapRef<T> | undefined> {
  if (__DEV__ && arguments.length > 0) {
    // 开发环境检查序列化
    warnNonSerializable(value, 'ref');
  }
  return _ref(value) as Ref<UnwrapRef<T> | undefined>; // 调用 Vue 的 ref
}

// 第160-161行：导出 shallowRef
export { shallowRef, type ShallowRef };
const shallowRef = _shallowRef; // 直接使用 Vue 的实现

// 第164-169行：reactive 函数 - 创建响应式对象
export function reactive<T extends object>(target: T): Reactive<T> {
  if (__DEV__) {
    warnNonSerializable(target, 'reactive'); // 开发环境检查
  }
  return _reactive(target) as Reactive<T>;
}

// 第171-172行：导出 shallowReactive
export { shallowReactive };
const shallowReactive = _shallowReactive;

// 第175-177行：readonly 函数 - 创建只读响应式对象
export function readonly<T extends object>(target: T): DeepReadonly<T> {
  return _readonly(target) as DeepReadonly<T>;
}

// 第179-180行：导出 shallowReadonly
export { shallowReadonly };
const shallowReadonly = _shallowReadonly;

// 第183-194行：computed 函数 - 计算属性
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export function computed<T>(options: {
  get: ComputedGetter<T>;
  set: ComputedSetter<T>;
}): WritableComputedRef<T>;
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | { get: ComputedGetter<T>; set: ComputedSetter<T> }
): ComputedRef<T> | WritableComputedRef<T> {
  return _computed(getterOrOptions as Parameters<typeof _computed>[0]) as
    | ComputedRef<T>
    | WritableComputedRef<T>;
}

// 第197-213行：watch 函数 - 侦听响应式数据变化
export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle;
export function watch<T extends WatchSource<unknown>>(
  source: T,
  callback: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle;
export function watch(
  source: WatchSource<unknown> | WatchSource<unknown>[],
  callback: WatchCallback<unknown>,
  options?: WatchOptions
): WatchStopHandle {
  return _watch(source, callback, options); // 直接代理给 Vue 的 watch
}

// 第216-248行：watchEffect 实现 - 立即执行的副作用

// 第216行：定义 WatchEffect 类型
export type WatchEffect = (onCleanup: OnCleanup) => void;

// 第219-248行：watchEffect 函数实现
export function watchEffect(effect: WatchEffect, options?: WatchOptionsBase): WatchStopHandle {
  let cleanup: (() => void) | undefined;

  // onCleanup 回调：注册清理函数
  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = fn;
  };

  // 创建 effect
  const runner = _effect(
    () => {
      if (cleanup) {
        cleanup(); // 执行上次的清理函数
        cleanup = undefined;
      }
      effect(onCleanup); // 执行用户传入的 effect
    },
    {
      lazy: false, // 立即执行
      scheduler:
        options?.flush === 'sync'
          ? undefined
          : () => {
              nextTick(() => runner()); // 非同步模式下使用 nextTick 调度
            }
    }
  );

  // 返回停止函数
  return () => {
    if (cleanup) {
      cleanup(); // 执行清理
    }
    _stop(runner); // 停止 effect
  };
}

// 第251-278行：导出所有工具函数和类型
export {
  effectScope,
  getCurrentScope,
  onScopeDispose,
  toRaw,
  toRef,
  toRefs,
  isRef,
  isReactive,
  isReadonly,
  isProxy,
  unref,
  proxyRefs,
  customRef,
  triggerRef,
  type EffectScope,
  type UnwrapRef,
  type ShallowUnwrapRef,
  type ReactiveFlags,
  type WatchCallback,
  type WatchSource,
  type WatchStopHandle,
  type WatchOptions,
  type WatchOptionsBase,
  type OnCleanup,
  type ComputedGetter,
  type ComputedSetter
};
