// 导出 h 函数和 VNode 相关
export {
  h,
  isVNode,
  createTextVNode,
  Fragment,
  hFragment,
  type VNode,
  type Component,
  type NormalizedChildren
} from './h.js';

// 导出渲染函数
export {
  render,
  patch,
  createElement,
  isSameVNodeType,
  type VNode as RenderVNode,
  type Component as RenderComponent
} from './render.js';

// 导出调度器
export {
  scheduler,
  nextTick,
  flush,
  queueJob,
  queuePostFlushCb,
  type Scheduler
} from './scheduler.js';
