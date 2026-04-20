# Mini-FC 架构文档

> 版本: v1.1  
> 最后更新: 2026-04-18  
> 技术栈: Petite Vue 0.5.1 + TypeScript  

---

## 📋 目录

1. [整体架构概述](#1-整体架构概述)
2. [模块依赖关系](#2-模块依赖关系)
3. [核心模块详解](#3-核心模块详解)
4. [状态管理](#4-状态管理)
5. [路由系统](#5-路由系统)
6. [UI 组件库](#6-ui-组件库)
7. [CLI 脚手架](#7-cli-脚手架)
8. [架构决策记录](#8-架构决策记录)
9. [性能指标](#9-性能指标)
10. [API 稳定性](#10-api-稳定性)

---

## 1. 整体架构概述

### 1.1 架构理念

Mini-FC 是一个基于 Petite Vue 封装的轻量级前端框架，遵循以下设计原则：

| 原则 | 说明 |
|------|------|
| **极简体积** | 核心包 ≤ 20KB (gzip)，单组件 ≤ 3KB |
| **Composition API** | 仅支持 Composition API，与 Vue3 生态兼容 |
| **TypeScript 优先** | Strict 模式，禁止 `any` 类型 |
| **Monorepo 结构** | pnpm workspaces，模块清晰分离 |

### 1.2 架构分层

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层 (Application)                       │
│                    用户代码 / 业务组件                              │
├─────────────────────────────────────────────────────────────────┤
│                        业务层 (Business)                          │
│              @mini-fc/ui 组件库 / @mini-fc/store 状态管理           │
├─────────────────────────────────────────────────────────────────┤
│                        核心层 (Core)                              │
│      @my-framework/core (渲染引擎 + 组件系统 + 响应式系统)           │
│         ┌──────────────┬──────────────┬──────────────┐            │
│         │  Reactivity  │  Component   │   Renderer   │            │
│         │   (@vue/)    │  (define)    │ (h/render)   │            │
│         └──────────────┴──────────────┴──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│                        基础设施层 (Infrastructure)                 │
│              @mini-fc/router / @mini-fc/cli 脚手架                │
├─────────────────────────────────────────────────────────────────┤
│                        浏览器 API (Browser)                       │
│                    DOM API / Event API                            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 核心特性

- **响应式系统**: 基于 `@vue/reactivity`，完全兼容 Vue3 API
- **组件系统**: `defineComponent` 支持 Props 验证、Slots 插槽、Emit 事件
- **渲染引擎**: Virtual DOM + Patch 算法 + 调度器 (Scheduler)
- **路由系统**: Hash/History 双模式，支持嵌套路由
- **状态管理**: Pinia 风格 API，基于响应式系统自动追踪依赖
- **UI 组件库**: 10 个原子组件，CSS 变量主题系统
- **CLI 工具**: 基于 Vite 封装，支持 create/dev/build/preview

---

## 2. 模块依赖关系

### 2.1 依赖图

```
                    ┌─────────────────┐
                    │   @mini-fc/cli  │
                    │   (脚手架工具)    │
                    └────────┬────────┘
                             │ 依赖
                             ▼
┌───────────────┐    ┌─────────────────┐    ┌───────────────┐
│ @mini-fc/ui   │◄───│ @my-framework/  │───►│ @mini-fc/     │
│ (UI组件库)     │依赖 │ core (核心包)    │依赖 │ router (路由)  │
└───────────────┘    └────────┬────────┘    └───────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ @vue/      │  │ 内置组件    │  │ 渲染引擎    │
       │ reactivity │  │ 系统       │  │ (h/render) │
       └────────────┘  └────────────┘  └────────────┘
                                              │
                                              ▼
                                       ┌────────────┐
                                       │ 调度器      │
                                       │ scheduler  │
                                       └────────────┘

@mini-fc/store ───────────────────────► @my-framework/core
(状态管理)                              (使用响应式系统)
```

### 2.2 包清单

| 包名 | 路径 | 版本 | 体积(gzip) | 依赖 |
|------|------|------|-----------|------|
| `@my-framework/core` | `packages/core/` | v1.0 | ≤ 15KB | `@vue/reactivity` |
| `@mini-fc/router` | `packages/router/` | v1.1 | ≤ 5KB | `@my-framework/core` |
| `@mini-fc/store` | `packages/store/` | v1.0 | ≤ 2KB | `@my-framework/core` |
| `@mini-fc/ui` | `packages/ui/` | v1.0 | ≤ 20KB | `@my-framework/core` |
| `@mini-fc/cli` | `packages/cli/` | v1.0 | ≤ 500行 | `vite`, `commander.js`, `kolorist` |

---

## 3. 核心模块详解

### 3.1 响应式系统 (Reactivity)

**位置**: `packages/core/src/reactivity/index.ts`

**实现方式**: 直接导出 `@vue/reactivity` 包，确保与 Vue3 生态完全兼容。

**暴露 API**:

```typescript
// 基础响应式
export { ref, reactive, readonly, shallowRef, shallowReactive }

// 计算属性
export { computed }

// 侦听器
export { watch, watchEffect }

// 工具函数
export { toRef, toRefs, unref, isRef, isReactive, isProxy, isReadonly, triggerRef }

// 类型
export type { Ref, ComputedRef, ReactiveEffect, UnwrapRef }
```

**设计决策 (ADR-001)**:
- 直接依赖 `@vue/reactivity` 而非自行实现
- 减少开发成本，确保与 Vue3 生态兼容
- 遵循 Vue 的响应式 API 规范

### 3.2 组件系统 (Component)

**位置**: `packages/core/src/component/defineComponent.ts`

#### 3.2.1 核心类型定义

```typescript
// 组件实例
interface ComponentInstance {
  name: string;
  props: Ref<Record<string, unknown>>;
  setupResult: RenderFn | object;
  context: SetupContext;
  isMounted: boolean;
  emit: EmitFn;
}

// Setup 上下文（含 Slots 支持）
interface SetupContext {
  emit: EmitFn;
  slots: Slots;
}

// Slots 类型
type Slots = Record<string, () => VNode[]>;

// 组件定义
interface Component {
  name: string;
  props?: Record<string, PropType<unknown>>;
  setup: (props: Record<string, unknown>, context: SetupContext) => RenderFn | object;
}
```

#### 3.2.2 defineComponent API

```typescript
// Props 类型定义示例
interface ButtonProps {
  type?: 'primary' | 'default' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// 组件定义
const Button = defineComponent({
  name: 'Button',
  props: {
    type: { type: String, default: 'default' },
    size: { type: String, default: 'medium' },
    disabled: { type: Boolean, default: false }
  },
  setup(props, { slots, emit }) {
    // props.type, props.size 具有完整类型推断
    return () => h('button', { 
      class: `btn btn-${props.type} btn-${props.size}`,
      disabled: props.disabled
    }, slots.default?.());
  }
});
```

#### 3.2.3 Props 验证系统

支持以下类型校验：
- `String` - 字符串类型
- `Number` - 数字类型
- `Boolean` - 布尔类型
- `Function` - 函数类型
- `Object` - 对象类型
- `Array` - 数组类型
- `Symbol` - Symbol 类型

支持以下选项：
- `required: boolean` - 是否必填
- `default: T | () => T` - 默认值（支持函数返回）

### 3.3 渲染引擎 (Renderer)

#### 3.3.1 h 函数 (Virtual DOM)

**位置**: `packages/core/src/renderer/h.ts`

```typescript
// VNode 结构
interface VNode {
  type: string | Component | null;  // null 表示文本节点
  props: Record<string, unknown>;
  children: (VNode | string)[];
  key?: string | number;
  el?: HTMLElement | Text | null;
}

// h 函数签名
function h(type: string | Component): VNode;
function h(type: string | Component, props: Record<string, unknown> | null): VNode;
function h(
  type: string | Component,
  props: Record<string, unknown> | null,
  children: unknown
): VNode;
```

**特殊类型**:
- `type: null` - 文本节点
- `type: Fragment` - 片段节点（渲染多个根节点）

#### 3.3.2 render 函数

**位置**: `packages/core/src/renderer/render.ts`

```typescript
// 核心渲染函数
function render(vnode: VNode | null, container: HTMLElement): void

// patch 算法 - 比较并更新 VNode
function patch(oldVNode: VNode, newVNode: VNode, container: HTMLElement, index?: number): void

// 创建 DOM 元素
function createElement(vnode: VNode): HTMLElement | Text

// 比较 VNode 类型
function isSameVNodeType(n1: VNode, n2: VNode): boolean
```

**支持的 DOM 属性**:
- 事件处理: `onClick`, `onInput` 等 (自动添加/移除事件监听器)
- Class: 支持字符串、数组、对象三种形式
- Style: 支持字符串、对象两种形式
- 布尔属性: 自动处理 `disabled`, `checked` 等
- 普通属性: 通过 `setAttribute` 设置

**Patch 算法特性**:
- 基于类型的快速比较
- 简化版的子节点 diff（不做双端优化）
- 支持 Key 属性

**设计决策 (ADR-004)**:
- Patch 仅做简单 children 比对，不做双端 diff 或 key 优化
- 控制代码复杂度，保持体积小（<300行）
- 大数据列表更新性能一般，建议用户配合 key 使用

#### 3.3.3 调度器 (Scheduler)

**位置**: `packages/core/src/renderer/scheduler.ts`

```typescript
interface Scheduler {
  nextTick<T>(fn?: () => T): Promise<T>;  // 下一个微任务执行
  flush(): void;                           // 强制刷新队列
  queueJob(job: () => void): void;         // 排队任务
}

// 导出函数
export { queueJob, queuePostFlushCb, nextTick, flush, scheduler }
```

**特性**:
- 基于 Promise 微任务队列
- 自动去重 (同一任务不会重复入队)
- 批量执行 (flush 时清空队列)

---

## 4. 状态管理

**位置**: `packages/store/src/`

### 4.1 设计理念

基于 Pinia 风格的轻量级状态管理，完全依赖 `@vue/reactivity` 实现响应式。

**设计决策 (ADR-007)**:
- API 熟悉度高，开发者学习成本低
- 完全基于 `@vue/reactivity`，无需额外依赖
- 单例模式确保全局状态一致性

### 4.2 API 概览

```typescript
// 定义 Store
const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: 'John',
    age: 30,
    isLoggedIn: false
  }),
  getters: {
    // 方式1: 通过 state 参数访问
    displayName: (state) => `${state.name} (${state.age})`,
    // 方式2: 通过 this 访问（需使用 function）
    greeting: function() {
      return `Hello, ${this.name}!`;
    }
  },
  actions: {
    login(username: string) {
      this.name = username;
      this.isLoggedIn = true;
    },
    logout() {
      this.isLoggedIn = false;
    }
  }
});

// 使用 Store
const userStore = useUserStore();

// 访问状态（自动解包）
console.log(userStore.name);        // 'John'
console.log(userStore.displayName); // 'John (30)'

// 调用 Action
userStore.login('Jane');
```

### 4.3 Store 管理 API

```typescript
// 获取 Store 实例（用于外部访问）
function getStoreById<StoreType>(id: StoreId): StoreType | undefined

// 删除 Store
function deleteStore(id: StoreId): boolean

// 清空所有 Store
function clearStores(): void
```

---

## 5. 路由系统

**位置**: `packages/router/src/`

### 5.1 路由配置

```typescript
interface RouterOptions {
  routes: Route[];
  base?: string;
  mode?: 'hash' | 'history';
}

interface Route {
  path: string;
  name?: string;
  component: Component | (() => Promise<Component>);
  children?: Route[];
  meta?: Record<string, unknown>;
}
```

### 5.2 使用方式

```typescript
import { createRouter, RouterView, RouterLink } from '@mini-fc/router';
import { h } from '@my-framework/core';

// 定义路由
const router = createRouter({
  mode: 'hash',  // 或 'history'
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { 
      path: '/user/:id', 
      component: User,
      children: [
        { path: 'profile', component: UserProfile }
      ]
    }
  ]
});

// 在应用中使用
const App = defineComponent({
  name: 'App',
  setup() {
    return () => h('div', { id: 'app' }, [
      h('nav', {}, [
        h(RouterLink, { to: '/' }, () => 'Home'),
        h(RouterLink, { to: '/about' }, () => 'About')
      ]),
      h(RouterView)  // 路由出口
    ]);
  }
});
```

### 5.3 内置组件

| 组件 | 功能 |
|------|------|
| `RouterView` | 路由出口，根据当前路径渲染匹配组件 |
| `RouterLink` | 导航链接，支持 `to` 属性指定目标路径 |

### 5.4 路由模式

**设计决策 (ADR-003)**:
- Router 默认使用 Hash 模式，支持 History 模式
- 减少兼容性测试成本，IE11 支持更简单
- URL 会包含 # 号，不支持服务端渲染(SSR)

| 模式 | URL 示例 | 说明 |
|------|----------|------|
| `hash` | `/#/about` | 默认模式，兼容性好 |
| `history` | `/about` | 需要服务端配合 |

---

## 6. UI 组件库

**位置**: `packages/ui/src/components/`

### 6.1 组件清单

| 组件 | 路径 | 功能 |
|------|------|------|
| `Button` | `button/` | 按钮，支持 type/size/disabled/loading |
| `Input` | `input/` | 输入框，支持 v-model/clearable |
| `Select` | `select/` | 选择器，支持下拉选项 |
| `Switch` | `switch/` | 开关，支持 v-model |
| `Modal` | `modal/` | 模态框，支持打开/关闭动画 |
| `Card` | `card/` | 卡片，支持 header/default/footer slots |
| `List` | `list/` | 列表，支持数据渲染 |
| `Toast` | `toast/` | 轻提示，支持 API 调用 |
| `Loading` | `loading/` | 加载，支持全局/局部 |
| `Layout` | `layout/` | 布局容器 |

### 6.2 主题系统

**设计决策 (ADR-005)**:
- UI 组件库使用 CSS 变量定义设计系统
- 运行时主题切换，无需编译，体积最小化

**CSS 变量定义** (`packages/ui/src/styles/variables.css`):

```css
:root {
  /* 主色调 */
  --mc-color-primary: #409eff;
  --mc-color-success: #67c23a;
  --mc-color-warning: #e6a23c;
  --mc-color-danger: #f56c6c;
  --mc-color-info: #909399;
  
  /* 中性色 */
  --mc-color-white: #ffffff;
  --mc-color-black: #000000;
  --mc-color-text-primary: #303133;
  --mc-color-text-regular: #606266;
  --mc-color-text-secondary: #909399;
  --mc-color-text-placeholder: #c0c4cc;
  
  /* 边框颜色 */
  --mc-border-color-base: #dcdfe6;
  --mc-border-color-light: #e4e7ed;
  --mc-border-color-lighter: #ebeef5;
  
  /* 字体大小 */
  --mc-font-size-extra-large: 20px;
  --mc-font-size-large: 18px;
  --mc-font-size-medium: 16px;
  --mc-font-size-base: 14px;
  --mc-font-size-small: 13px;
  --mc-font-size-extra-small: 12px;
}
```

### 6.3 Slots 支持

**设计决策 (ADR-011)**:
- SetupContext 添加 slots 属性
- 渲染器 mountComponentVNode 将 vnode.children 作为 default slot 传递

```typescript
// Card 组件使用 Slots 示例
const Card = defineComponent({
  name: 'Card',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: 'mc-card' }, [
      slots.header?.() || (props.title && h('div', { class: 'mc-card__header' }, props.title)),
      h('div', { class: 'mc-card__body' }, slots.default?.()),
      slots.footer?.() && h('div', { class: 'mc-card__footer' }, slots.footer())
    ]);
  }
});
```

---

## 7. CLI 脚手架

**位置**: `packages/cli/`

### 7.1 设计理念

**设计决策 (ADR-008)**:
- 基于 Vite 封装 CLI 工具，使用 commander.js 和 kolorist
- 不重复造轮子，直接复用 Vite 的强大功能
- CLI 代码量控制在 500 行以内

### 7.2 命令列表

```bash
# 创建新项目
mini-fc create <project-name>

# 启动开发服务器
mini-fc dev

# 构建生产版本
mini-fc build

# 预览生产构建
mini-fc preview
```

### 7.3 项目模板结构

```
my-project/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.ts
    └── style.css
```

---

## 8. 架构决策记录

### ADR-001: 使用 @vue/reactivity

**决策**: 直接依赖 `@vue/reactivity` 包，而非自行实现响应式系统  
**原因**: 减少开发成本，确保与 Vue3 生态兼容  
**影响**: 需要遵循 Vue 的响应式 API 规范

### ADR-002: 放弃 SFC 编译器

**决策**: 不实现 .vue 单文件编译器，使用 JSX + h() 函数  
**原因**: 编译器开发成本过高（约2周工作量），与轻量定位不符  
**影响**: 用户需要写 h() 或使用 JSX（通过 @vitejs/plugin-vue-jsx）

### ADR-003: Hash 模式路由

**决策**: Router 默认使用 Hash 模式，支持 History 模式  
**原因**: 减少兼容性测试成本，IE11 支持更简单  
**影响**: URL 会包含 # 号，不支持服务端渲染(SSR)

### ADR-004: 简化 Diff 算法

**决策**: patch 仅做简单 children 比对，不做双端 diff 或 key 优化  
**原因**: 控制代码复杂度，保持体积小（<300行）  
**影响**: 大数据列表更新性能一般，建议用户配合 key 使用

### ADR-005: CSS 变量主题系统

**决策**: UI 组件库使用 CSS 变量定义设计系统  
**原因**: 运行时主题切换，无需编译，体积最小化  
**影响**: 需要现代浏览器支持（IE11 不支持）

### ADR-006: 组件库依赖 core

**决策**: `@mini-fc/ui` 依赖 `@my-framework/core`  
**原因**: 复用核心响应式系统和组件定义  
**影响**: 必须保持 core API 稳定性

### ADR-007: Store 状态管理设计

**决策**: 实现 Pinia 风格的轻量级状态管理  
**原因**: 
- API 熟悉度高，开发者学习成本低
- 完全基于 @vue/reactivity，无需额外依赖
- 单例模式确保全局状态一致性

### ADR-008: CLI 工具设计

**决策**: 基于 Vite 封装 CLI 工具，使用 commander.js 和 kolorist  
**原因**:
- 不重复造轮子，直接复用 Vite 的强大功能
- commander.js 是 Node.js CLI 的标准解决方案
- kolorist 提供跨平台的彩色输出

### ADR-010: 修复 RouterView 组件渲染问题

**决策**: 修复 RouterView 中异步组件解析导致的渲染时序问题  
**原因**:
- 使用 async/await 在 watch 回调中导致组件赋值延迟
- 渲染函数在组件赋值前执行，导致显示 "No matched route"
**影响**:
- 当前仅支持同步定义的组件
- 异步组件（懒加载）需要后续实现

### ADR-011: 添加 Slots 支持

**决策**: 为 SetupContext 添加 slots 支持，使 UI 组件能使用插槽  
**原因**:
- Card 等 UI 组件需要使用 slots（header/default/footer）
- 原 SetupContext 只有 emit，没有 slots
- 渲染器 mountComponentVNode 未传递 slots 给组件

---

## 9. 性能指标

### 9.1 体积预算

| 包 | 体积 (gzip) | 状态 |
|----|-------------|------|
| @my-framework/core | ≤ 15KB | ✅ 达标 |
| @mini-fc/router | ≤ 5KB | ✅ 达标 |
| @mini-fc/store | ≤ 2KB | ✅ 达标 |
| @mini-fc/ui | ≤ 20KB | ✅ 达标 |
| 单组件平均 | ≤ 3KB | ✅ 达标 |

### 9.2 性能特点

| 特性 | 实现方式 | 性能表现 |
|------|----------|----------|
| 响应式追踪 | Proxy (Vue) | 原生性能，无 overhead |
| DOM 更新 | Patch 算法 | 简单 diff，小数据量优秀 |
| 任务调度 | Promise 微任务 | 批量更新，自动去重 |
| 组件渲染 | 函数式 | 无实例开销 |

### 9.3 已知限制

**问题-001**: 组件更新逻辑简化
- **位置**: render.ts:324-328 (mountComponentVNode 函数)
- **状态**: 组件更新时仅重新渲染，未实现精细化更新
- **影响**: 组件 props 更新时可能性能不佳
- **方案**: 后续可引入响应式依赖追踪

**问题-002**: emits 类型推断不完整
- **位置**: component/defineComponent.ts
- **状态**: EmitFn 仅支持基本事件名，不支持类型推断
- **影响**: TypeScript 无法推断 emit 参数类型
- **方案**: 需增强类型定义

---

## 10. API 稳定性

### 10.1 已稳定的 API ✅

**响应式系统**:
- `ref`, `reactive`, `computed`, `watch`, `watchEffect`

**组件系统**:
- `defineComponent`
- `mountComponent`, `unmountComponent`, `updateComponentProps`

**渲染引擎**:
- `h`, `render`, `scheduler`

**路由系统**:
- `createRouter`, `RouterView`, `RouterLink`

**状态管理**:
- `defineStore`, `getStoreById`, `deleteStore`, `clearStores`

**CLI**:
- `mini-fc create`, `mini-fc dev`, `mini-fc build`, `mini-fc preview`

**UI 组件**:
- `Button`, `Input`, `Select`, `Switch`, `Modal`, `Card`, `List`, `Toast`, `Loading`, `Layout`

**Slots 支持**:
- `slots.default?.()`, `slots.header?.()`, `slots.footer?.()`

### 10.2 可能变更的 API ⚠️

- `EmitFn` 可能会增加更多上下文方法
- `VNode` 类型可能会扩展

---

## 附录 A: 项目结构

```
Mini-FC framework/
├── packages/
│   ├── core/                    # 核心包
│   │   ├── src/
│   │   │   ├── reactivity/      # 响应式系统
│   │   │   ├── component/       # 组件系统
│   │   │   │   └── defineComponent.ts
│   │   │   └── renderer/        # 渲染引擎
│   │   │       ├── h.ts
│   │   │       ├── render.ts
│   │   │       └── scheduler.ts
│   │   └── package.json
│   ├── router/                  # 路由系统
│   │   ├── src/
│   │   │   ├── router.ts
│   │   │   ├── route.ts
│   │   │   ├── components.ts
│   │   │   └── types.ts
│   │   └── package.json
│   ├── store/                   # 状态管理
│   │   ├── src/
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── ui/                      # UI 组件库
│   │   ├── src/
│   │   │   ├── components/      # 10个原子组件
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   ├── switch/
│   │   │   │   ├── modal/
│   │   │   │   ├── card/
│   │   │   │   ├── list/
│   │   │   │   ├── toast/
│   │   │   │   ├── loading/
│   │   │   │   └── layout/
│   │   │   └── styles/          # CSS 变量主题
│   │   └── package.json
│   └── cli/                     # 脚手架
│       ├── bin/
│       │   └── cli.js
│       ├── src/
│       │   ├── index.ts
│       │   ├── create.ts
│       │   ├── dev.ts
│       │   └── build.ts
│       └── templates/
│           └── default/
├── PROJECT_MEMORY.md            # 项目记忆文件
├── ARCHITECTURE.md              # 本文档
└── package.json
```

## 附录 B: 快速开始

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行测试（带覆盖率）
npx vitest run --coverage

# 构建
npm run build
```

---

*文档结束*
