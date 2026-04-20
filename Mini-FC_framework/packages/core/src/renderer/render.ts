import { effect, stop } from '@vue/reactivity';

import type { ComponentInstance } from '../component/defineComponent.js';

import type { VNode, Component } from './h.js';
import { isVNode, Fragment } from './h.js';
import { queueJob, nextTick } from './scheduler.js';

// DEV 标志
const __DEV__ = process.env.NODE_ENV !== 'production';

// 事件名前缀
const EVENT_PREFIX = 'on';
const EVENT_PREFIX_LENGTH = EVENT_PREFIX.length;

// 检查是否为事件处理器
function isEventHandler(key: string): boolean {
  return (
    key.length > EVENT_PREFIX_LENGTH &&
    key.startsWith(EVENT_PREFIX) &&
    key[EVENT_PREFIX_LENGTH] === key[EVENT_PREFIX_LENGTH].toUpperCase()
  );
}

// 提取事件名
function extractEventName(key: string): string {
  return key.slice(EVENT_PREFIX_LENGTH).toLowerCase();
}

// 设置 DOM 属性
function setDOMAttribute(el: HTMLElement, key: string, value: unknown, oldValue: unknown): void {
  // 处理事件
  if (isEventHandler(key)) {
    const eventName = extractEventName(key);
    if (oldValue) {
      el.removeEventListener(eventName, oldValue as EventListener);
    }
    if (value) {
      el.addEventListener(eventName, value as EventListener);
    }
    return;
  }

  // 处理 class
  if (key === 'class' || key === 'className') {
    if (typeof value === 'string') {
      el.className = value;
    } else if (Array.isArray(value)) {
      el.className = value.filter(Boolean).join(' ');
    } else if (typeof value === 'object' && value !== null) {
      el.className = Object.entries(value)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(' ');
    }
    return;
  }

  // 处理 style
  if (key === 'style') {
    if (typeof value === 'string') {
      el.setAttribute('style', value);
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(el.style, value);
    }
    return;
  }

  // 处理 key 和 ref（不设置到 DOM）
  if (key === 'key' || key === 'ref') {
    return;
  }

  // 处理布尔属性
  if (typeof value === 'boolean') {
    if (value) {
      el.setAttribute(key, '');
    } else {
      el.removeAttribute(key);
    }
    return;
  }

  // 处理普通属性
  if (value === null || value === undefined) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, String(value));
  }
}

// 移除 DOM 属性
function removeDOMAttribute(el: HTMLElement, key: string, oldValue: unknown): void {
  if (isEventHandler(key)) {
    const eventName = extractEventName(key);
    el.removeEventListener(eventName, oldValue as EventListener);
    return;
  }

  if (key === 'class' || key === 'className') {
    el.className = '';
    return;
  }

  if (key === 'style') {
    el.removeAttribute('style');
    return;
  }

  el.removeAttribute(key);
}

// 创建真实 DOM 元素
function createElement(vnode: VNode): HTMLElement | Text {
  const { type, props, children } = vnode;

  // 文本节点
  if (type === null) {
    const text = children.length > 0 ? String(children[0]) : '';
    return document.createTextNode(text);
  }

  // Fragment - 返回一个文档片段
  if (type === Fragment) {
    const fragment = document.createDocumentFragment();
    for (const child of children) {
      if (typeof child === 'string') {
        fragment.appendChild(document.createTextNode(child));
      } else if (isVNode(child)) {
        fragment.appendChild(createElement(child));
      }
    }
    return fragment as unknown as HTMLElement;
  }

  // 组件
  if (typeof type === 'object') {
    // 对于根级组件挂载，需要传入容器，但 createElement 没有容器参数
    // 我们使用 document.createDocumentFragment 作为临时容器
    const tempContainer = document.createDocumentFragment() as unknown as HTMLElement;
    return mountComponentVNode(vnode, tempContainer);
  }

  // 普通元素
  const el = document.createElement(type);

  // 设置属性
  for (const [key, value] of Object.entries(props)) {
    setDOMAttribute(el, key, value, undefined);
  }

  // 挂载子节点
  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (isVNode(child)) {
      el.appendChild(createElement(child));
    }
  }

  return el;
}

// 组件更新函数 - 用于触发组件重新渲染
function updateComponent(instance: ComponentInstance): void {
  if (!instance.isMounted || !instance.subTree || !instance.container) {
    return;
  }

  // 将更新任务加入调度队列，避免同步更新导致的性能问题
  queueJob(() => {
    componentUpdateFn(instance);
  });
}

// 组件实际更新函数
function componentUpdateFn(instance: ComponentInstance): void {
  if (!instance.isMounted || !instance.container) {
    return;
  }

  const { subTree, container } = instance;
  const setupResult = instance.setupResult;

  if (typeof setupResult !== 'function') {
    return;
  }

  // 执行渲染函数获取新的 VNode
  const nextTree = (setupResult as () => VNode)();

  // 获取旧的 DOM 元素
  const oldEl = subTree.el;

  if (!oldEl || !oldEl.parentNode) {
    return;
  }

  // 创建新的 DOM 元素
  const newEl = createElement(nextTree);

  // 替换旧的 DOM 元素
  oldEl.parentNode.replaceChild(newEl, oldEl);

  // 更新 subTree 引用
  instance.subTree = nextTree;
  nextTree.el = newEl;

  if (__DEV__) {
    console.log(`[mini-fc]: Component "${instance.name}" updated`);
  }
}

// 挂载组件 VNode
function mountComponentVNode(vnode: VNode, container: HTMLElement): HTMLElement {
  const component = vnode.type as Component;
  const props = { ...vnode.props };

  // 创建 slots（将 children 作为 default slot）
  const slots: Record<string, () => VNode[]> = {
    default: () => vnode.children as VNode[]
  };

  // 创建组件实例
  const instance: ComponentInstance = {
    name: component.name,
    props: { value: props } as { value: Record<string, unknown> },
    setupResult: null,
    context: {
      emit: () => {},
      slots
    },
    isMounted: false,
    emit: () => {},
    container: null,
    subTree: null,
    update: undefined
  };

  // 将实例附加到 vnode 以便后续更新使用
  (vnode as unknown as { componentInstance?: ComponentInstance }).componentInstance = instance;

  // 执行 setup
  const setupResult = component.setup(props, instance.context);
  instance.setupResult = setupResult;

  // 如果 setup 返回函数，则作为渲染函数
  if (typeof setupResult === 'function') {
    const renderFn = setupResult as () => VNode;

    // 首次渲染 - 不使用 effect，直接渲染获取元素
    const initialRenderResult = renderFn();
    const el = createElement(initialRenderResult);
    instance.subTree = initialRenderResult;
    instance.subTree.el = el;
    instance.isMounted = true;
    instance.container = container;
    vnode.el = el;

    if (__DEV__) {
      console.log(`[mini-fc]: Component "${instance.name}" mounted with reactive effect`);
    }

    // 使用 effect 包裹渲染函数，用于追踪依赖并在数据变化时触发更新
    // 注意：effect 会在创建时立即执行一次，所以我们需要确保此时不会导致重复渲染
    let isInitialEffectRun = true;
    const renderEffect = effect(
      () => {
        // 执行渲染函数，此时会追踪响应式依赖
        renderFn();
        // effect 只负责追踪依赖，不直接操作 DOM
        // 首次运行时跳过（因为已经渲染过了）
        if (isInitialEffectRun) {
          isInitialEffectRun = false;
          return;
        }
      },
      {
        scheduler: () => {
          // 当响应式依赖变化时，调度更新
          if (instance.update) {
            instance.update();
          }
        }
      }
    );

    instance.effect = renderEffect;
    instance.update = () => updateComponent(instance);

    return el;
  } else {
    // setup 返回对象而非函数，渲染一个空 div
    const renderResult: VNode = {
      type: 'div',
      props: {},
      children: [],
      el: null
    };

    const el = createElement(renderResult);
    instance.subTree = renderResult;
    instance.subTree.el = el;
    instance.isMounted = true;
    instance.container = container;
    vnode.el = el;

    if (__DEV__) {
      console.log(`[mini-fc]: Component "${instance.name}" mounted without render function`);
    }

    return el;
  }
}

// 更新 DOM 属性
function patchProps(
  el: HTMLElement,
  oldProps: Record<string, unknown>,
  newProps: Record<string, unknown>
): void {
  // 移除旧属性
  for (const key in oldProps) {
    if (!(key in newProps)) {
      removeDOMAttribute(el, key, oldProps[key]);
    }
  }

  // 设置新属性
  for (const key in newProps) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];
    if (oldValue !== newValue) {
      setDOMAttribute(el, key, newValue, oldValue);
    }
  }
}

// 比较两个 VNode 是否相同
function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key;
}

// 简单的子节点 diff
function patchChildren(
  parentEl: HTMLElement,
  oldChildren: (VNode | string)[],
  newChildren: (VNode | string)[]
): void {
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const minLen = Math.min(oldLen, newLen);

  // 更新公共部分
  for (let i = 0; i < minLen; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (typeof oldChild === 'string' && typeof newChild === 'string') {
      // 都是文本节点
      if (oldChild !== newChild && parentEl.childNodes[i]) {
        parentEl.childNodes[i].textContent = newChild;
      }
    } else if (isVNode(oldChild) && isVNode(newChild)) {
      // 都是 VNode
      patch(oldChild, newChild, parentEl, i);
    } else {
      // 类型不同，替换
      const newEl =
        typeof newChild === 'string' ? document.createTextNode(newChild) : createElement(newChild);

      if (parentEl.childNodes[i]) {
        parentEl.replaceChild(newEl, parentEl.childNodes[i]);
      } else {
        parentEl.appendChild(newEl);
      }
    }
  }

  // 添加新节点
  for (let i = minLen; i < newLen; i++) {
    const newChild = newChildren[i];
    const newEl =
      typeof newChild === 'string' ? document.createTextNode(newChild) : createElement(newChild);
    parentEl.appendChild(newEl);
  }

  // 移除多余节点
  for (let i = oldLen - 1; i >= minLen; i--) {
    if (parentEl.childNodes[i]) {
      parentEl.removeChild(parentEl.childNodes[i]);
    }
  }
}

// 核心 patch 函数 - 比较并更新 VNode
function patch(oldVNode: VNode, newVNode: VNode, container: HTMLElement, index?: number): void {
  // 如果类型不同，直接替换
  if (!isSameVNodeType(oldVNode, newVNode)) {
    const newEl = createElement(newVNode);
    const oldEl = oldVNode.el;

    if (oldEl && oldEl.parentNode) {
      if (typeof index === 'number' && oldEl.parentNode.childNodes[index]) {
        oldEl.parentNode.replaceChild(newEl, oldEl.parentNode.childNodes[index]);
      } else {
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
    }

    newVNode.el = newEl;
    return;
  }

  // 相同类型，更新
  const el = (newVNode.el = oldVNode.el);

  if (!el) return;

  // 文本节点
  if (newVNode.type === null) {
    const newText = newVNode.children.length > 0 ? String(newVNode.children[0]) : '';
    if (el.textContent !== newText) {
      el.textContent = newText;
    }
    return;
  }

  // 组件
  if (typeof newVNode.type === 'object') {
    // 组件更新：复用已有组件实例，触发重新渲染
    const oldComponentInstance = (oldVNode as unknown as { componentInstance?: ComponentInstance })
      .componentInstance;

    if (oldComponentInstance && oldComponentInstance.update) {
      // 更新 props
      const component = newVNode.type;
      const newProps = { ...newVNode.props };

      // 更新组件实例的 props
      oldComponentInstance.props.value = { ...oldComponentInstance.props.value, ...newProps };

      // 触发组件重新渲染
      oldComponentInstance.update();

      // 将组件实例附加到新的 vnode
      (newVNode as unknown as { componentInstance?: ComponentInstance }).componentInstance =
        oldComponentInstance;
      newVNode.el = oldVNode.el;
    }

    return;
  }

  // 元素节点
  const element = el as HTMLElement;

  // 更新属性
  patchProps(element, oldVNode.props, newVNode.props);

  // 更新子节点
  patchChildren(element, oldVNode.children, newVNode.children);
}

// 渲染函数 - 将 VNode 挂载或更新到容器
export function render(vnode: VNode | null, container: HTMLElement): void {
  if (__DEV__) {
    console.log('[mini-fc render]: Rendering vnode to container', container);
  }

  // 获取旧的 VNode
  const oldVNode = (container as unknown as { _vnode?: VNode })._vnode;

  if (vnode === null) {
    // 卸载
    if (oldVNode) {
      // 清空容器内容
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    (container as unknown as { _vnode?: VNode })._vnode = undefined;
    return;
  }

  if (oldVNode) {
    // 更新 - 需要特殊处理根节点
    patchRoot(oldVNode, vnode, container);
  } else {
    // 首次挂载
    const el = createElement(vnode);
    // 清空容器
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(el);
    vnode.el = el;
  }

  // 保存当前 VNode
  (container as unknown as { _vnode?: VNode })._vnode = vnode;
}

// 根节点 patch - 处理容器级别的更新
function patchRoot(oldVNode: VNode, newVNode: VNode, container: HTMLElement): void {
  // 如果类型不同，直接替换
  if (!isSameVNodeType(oldVNode, newVNode)) {
    const newEl = createElement(newVNode);
    const oldEl = oldVNode.el;

    if (oldEl && oldEl.parentNode) {
      oldEl.parentNode.replaceChild(newEl, oldEl);
    }

    newVNode.el = newEl;
    return;
  }

  // 相同类型，更新
  const el = (newVNode.el = oldVNode.el);

  if (!el) return;

  // 文本节点
  if (newVNode.type === null) {
    const newText = newVNode.children.length > 0 ? String(newVNode.children[0]) : '';
    if (el.textContent !== newText) {
      el.textContent = newText;
    }
    return;
  }

  // 组件
  if (typeof newVNode.type === 'object') {
    // 组件更新：复用已有组件实例，触发重新渲染
    const oldComponentInstance = (oldVNode as unknown as { componentInstance?: ComponentInstance })
      .componentInstance;

    if (oldComponentInstance && oldComponentInstance.update) {
      // 更新 props
      const newProps = { ...newVNode.props };

      // 更新组件实例的 props
      oldComponentInstance.props.value = { ...oldComponentInstance.props.value, ...newProps };

      // 触发组件重新渲染
      oldComponentInstance.update();

      // 将组件实例附加到新的 vnode
      (newVNode as unknown as { componentInstance?: ComponentInstance }).componentInstance =
        oldComponentInstance;
      newVNode.el = oldVNode.el;
    }

    return;
  }

  // 元素节点
  const element = el as HTMLElement;

  // 更新属性
  patchProps(element, oldVNode.props, newVNode.props);

  // 更新子节点
  patchChildren(element, oldVNode.children, newVNode.children);
}

// 导出类型和工具函数
export type { VNode, Component };
export { patch, createElement, isSameVNodeType };
