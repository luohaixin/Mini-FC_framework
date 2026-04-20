import type { Component } from '../component/defineComponent.js';

// DEV 标志
const __DEV__ = process.env.NODE_ENV !== 'production';

// VNode 类型定义
export interface VNode {
  type: string | Component | null;
  props: Record<string, unknown>;
  children: (VNode | string | number | boolean | null | undefined)[];
  key?: string | number;
  el?: HTMLElement | Text | null;
}

// 子节点规范化后的类型
export type NormalizedChildren = (VNode | string)[];

// h 函数重载签名
export function h(type: string | Component): VNode;
export function h(type: string | Component, props: Record<string, unknown> | null): VNode;
export function h(
  type: string | Component,
  props: Record<string, unknown> | null,
  children: unknown
): VNode;

// h 函数实现 - 创建虚拟 DOM 节点
export function h(
  type: string | Component,
  props?: Record<string, unknown> | null,
  children?: unknown
): VNode {
  if (__DEV__) {
    if (typeof type !== 'string' && typeof type !== 'object') {
      console.warn(`[mini-fc warn]: h() received invalid type: ${typeof type}`);
    }
  }

  // 规范化 props
  const normalizedProps = props ?? {};

  // 规范化 children
  const normalizedChildren = normalizeChildren(children);

  // 提取 key（如果存在）
  const key = normalizedProps.key as string | number | undefined;
  if (key !== undefined) {
    delete normalizedProps.key;
  }

  return {
    type,
    props: normalizedProps,
    children: normalizedChildren,
    key,
    el: null
  };
}

// 规范化子节点
function normalizeChildren(children: unknown): (VNode | string)[] {
  if (children === null || children === undefined) {
    return [];
  }

  if (Array.isArray(children)) {
    return children.flatMap(child => normalizeChild(child));
  }

  return normalizeChild(children);
}

// 规范化单个子节点
function normalizeChild(child: unknown): (VNode | string)[] {
  // 已经是 VNode
  if (isVNode(child)) {
    return [child as VNode];
  }

  // 基本类型转为字符串
  if (typeof child === 'string') {
    return [child];
  }

  if (typeof child === 'number') {
    return [String(child)];
  }

  if (typeof child === 'boolean') {
    return child ? ['true'] : ['false'];
  }

  // null 或 undefined 被忽略
  if (child === null || child === undefined) {
    return [];
  }

  // 数组递归处理
  if (Array.isArray(child)) {
    return child.flatMap(c => normalizeChild(c));
  }

  if (__DEV__) {
    console.warn(`[mini-fc warn]: Invalid child type: ${typeof child}`);
  }

  return [];
}

// 检查是否为 VNode
export function isVNode(value: unknown): value is VNode {
  return (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    'props' in value &&
    'children' in value
  );
}

// 创建文本 VNode
export function createTextVNode(text: string): VNode {
  return {
    type: null,
    props: {},
    children: [text],
    el: null
  };
}

// Fragment VNode（用于渲染多个根节点）
export const Fragment = Symbol('Fragment');

export function hFragment(children: unknown[]): VNode {
  return {
    type: Fragment as unknown as string,
    props: {},
    children: normalizeChildren(children),
    el: null
  };
}

// 导出类型
export type { Component };
