# Mini-FC Framework

> 一个轻量级、Vue3 风格的前端框架，基于 Petite Vue 理念构建

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-148%20passed-brightgreen.svg)]()

## ✨ 特性

- 🚀 **轻量级** - 核心包 < 20KB (gzip)
- 🎯 **Vue3 兼容** - 使用 Composition API，与 Vue3 生态无缝衔接
- 📦 **模块化** - 按需引入，只打包你需要的功能
- 🔧 **TypeScript** - 完整的类型支持，严格的类型检查
- 🧪 **测试覆盖** - 140+ 单元测试，确保代码质量
- 🎨 **UI 组件库** - 10+ 原子组件，支持 CSS 变量主题
- 🎰 **Slots 支持** - 完整的插槽系统，支持默认插槽和具名插槽

## 📦 安装

### 使用 CLI 创建项目（推荐）

```bash
# 使用 npx 直接创建项目（无需全局安装）
npx @mini-fc/cli create my-app

cd my-app
npm install
npm run dev
```

### 手动安装

如果你已有项目，可以手动安装需要的包：

```bash
# 安装核心框架
npm install @mini-fc/core

# 安装路由（可选）
npm install @mini-fc/router

# 安装状态管理（可选）
npm install @mini-fc/store

# 安装 UI 组件库（可选）
npm install @mini-fc/ui
```

### 手动创建项目

如果你没有使用 CLI，也可以手动创建项目：

```bash
# 创建项目目录
mkdir my-app
cd my-app

# 初始化 package.json
npm init -y
```

在 `package.json` 中添加依赖：

```json
{
  "name": "my-app",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mini-fc/core": "^1.0.0",
    "@mini-fc/router": "^1.0.0",
    "@mini-fc/store": "^1.0.0",
    "@mini-fc/ui": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

创建 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini-FC App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

创建 `src/main.ts`：

```typescript
import { h, render, defineComponent, ref } from '@mini-fc/core';
import { createRouter, RouterView } from '@mini-fc/router';
import { defineStore } from '@mini-fc/store';
import { Button, Card } from '@mini-fc/ui';

// 导入 UI 样式
import '@mini-fc/ui/dist/style.css';

// 创建 Store
const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() { this.count++; }
  }
});

// 组件
const Home = defineComponent({
  name: 'Home',
  setup() {
    const store = useCounterStore();
    return () => h('div', {}, [
      h('h1', {}, 'Hello Mini-FC!'),
      h(Card, { title: 'Counter' }, [
        h('p', {}, `Count: ${store.count.value}`),
        h(Button, { 
          type: 'primary',
          onClick: () => store.increment() 
        }, '+')
      ])
    ]);
  }
});

// 路由
const router = createRouter({
  routes: [{ path: '/', component: Home }],
  mode: 'hash'
});

// 应用入口
const App = defineComponent({
  name: 'App',
  setup() {
    return () => h('div', {}, [
      h(RouterView, {})
    ]);
  }
});

render(h(App, {}), document.getElementById('app')!);
```

安装依赖并启动：

```bash
npm install
npm run dev
```

## 🚀 快速开始

### 基础示例

```typescript
import { ref, computed, h, render } from '@mini-fc/core';
```
// 创建响应式状态
const count = ref(0);
const double = computed(() => count.value * 2);

// 创建虚拟 DOM
const vnode = h('div', { class: 'counter' }, [
  h('h1', null, 'Hello Mini-FC!'),
  h('p', null, `Count: ${count.value}`),
  h('p', null, `Double: ${double.value}`),
  h('button', {
    onClick: () => count.value++
  }, 'Increment')
]);

// 渲染到 DOM
render(vnode, document.getElementById('app')!);
```

### 组件定义

```typescript
import { defineComponent, ref, h } from '@mini-fc/core';
```
const Counter = defineComponent({
  name: 'Counter',
  props: {
    initial: { type: Number, default: 0 },
    step: { type: Number, default: 1 }
  },
  setup(props) {
    const count = ref(props.initial);
    
    const increment = () => {
      count.value += props.step;
    };
    
    return () => h('div', null, [
      h('span', null, `Count: ${count.value}`),
      h('button', { onClick: increment }, '+')
    ]);
  }
});

// 使用组件
const app = h(Counter, { initial: 10, step: 5 });
render(app, document.getElementById('app')!);
```

### 路由使用

```typescript
import { createRouter, RouterView } from '@mini-fc/router';
import { h, render, defineComponent } from '@mini-fc/core';
```
// 定义路由
const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/user/:id', component: User }
  ],
  mode: 'hash' // 或 'history'
});

// 在组件中使用
const App = defineComponent({
  name: 'App',
  setup() {
    return () => h('div', null, [
      h('nav', null, [
        h('a', { href: '#/' }, 'Home'),
        h('a', { href: '#/about' }, 'About')
      ]),
      h(RouterView, {})
    ]);
  }
});

// 导航
router.push('/about');
router.back();
```

### 状态管理

```typescript
import { defineStore } from '@mini-fc/store';

// 定义 Store
const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: 'John',
    age: 25,
    isLogin: false
  }),
  getters: {
    fullInfo: (state) => `${state.name} (${state.age})`
  },
  actions: {
    login(name: string) {
      this.name = name;
      this.isLogin = true;
    },
    logout() {
      this.isLogin = false;
    }
  }
});

// 在组件中使用
const UserProfile = defineComponent({
  name: 'UserProfile',
  setup() {
    const userStore = useUserStore();
    
    return () => h('div', null, [
      h('p', null, userStore.fullInfo),
      h('button', {
        onClick: () => userStore.login('Jane')
      }, 'Login')
    ]);
  }
});
```

### UI 组件使用

```typescript
import { Button, Input, Modal, Card } from '@mini-fc/ui';
// 导入样式
import '@mini-fc/ui/dist/style.css';

const App = defineComponent({
  name: 'App',
  setup() {
    const showModal = ref(false);
    const inputValue = ref('');
    
    return () => h('div', null, [
      h(Button, {
        type: 'primary',
        onClick: () => showModal.value = true
      }, 'Open Modal'),
      
      h(Input, {
        modelValue: inputValue.value,
        'onUpdate:modelValue': (v: string) => inputValue.value = v,
        placeholder: 'Enter something...'
      }),
      
      showModal.value && h(Modal, {
        title: 'Hello',
        onClose: () => showModal.value = false
      }, 'This is a modal content'),
      
      // Card 组件使用示例
      h(Card, { title: 'Card Title' }, [
        h('p', null, 'Card content goes here')
      ])
    ]);
  }
});
```

### Slots 插槽使用

```typescript
import { defineComponent, h } from '@mini-fc/core';
```
// 在组件中使用 slots
const MyComponent = defineComponent({
  name: 'MyComponent',
  setup(props, { slots }) {
    return () => h('div', { class: 'my-component' }, [
      h('header', null, slots.header?.()),
      h('main', null, slots.default?.()),
      h('footer', null, slots.footer?.())
    ]);
  }
});

// 使用带插槽的组件
const App = defineComponent({
  name: 'App',
  setup() {
    return () => h(MyComponent, null, {
      header: () => h('h1', null, 'Header Content'),
      default: () => h('p', null, 'Main Content'),
      footer: () => h('span', null, 'Footer Content')
    });
  }
});
```

## 📁 项目结构

```
Mini-FC framework/
├── packages/
│   ├── core/           # 核心框架（响应式、组件、渲染器）
│   ├── router/         # 路由系统
│   ├── store/          # 状态管理
│   ├── ui/             # UI 组件库
│   └── cli/            # CLI 脚手架
├── playground/         # 示例项目
├── coverage/           # 测试覆盖率报告
├── PROJECT_MEMORY.md   # 项目记忆库（跨对话状态恢复）
└── README.md
```

## 🛠️ CLI 命令

```bash
# 创建新项目
npx @mini-fc/cli create <project-name> [-t <template>]

# 或全局安装后使用
npm install -g @mini-fc/cli
mini-fc create <project-name>

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🧪 开发（框架开发者）

如果你是框架开发者，需要在本地开发：

```bash
# 克隆仓库
git clone <repository-url>
cd Mini-FC_framework

# 安装依赖
npm install

# 运行测试
npm test

# 运行测试（带覆盖率）
npm run test:coverage

# 构建所有包
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📚 API 文档

### 核心 API (@mini-fc/core)

#### 响应式

| API | 说明 | 示例 |
|-----|------|------|
| `ref()` | 创建响应式引用 | `const count = ref(0)` |
| `reactive()` | 创建响应式对象 | `const state = reactive({ count: 0 })` |
| `computed()` | 创建计算属性 | `const double = computed(() => count.value * 2)` |
| `watch()` | 监听变化 | `watch(count, (newVal) => console.log(newVal))` |
| `watchEffect()` | 自动追踪依赖 | `watchEffect(() => console.log(count.value))` |

#### 组件

| API | 说明 | 示例 |
|-----|------|------|
| `defineComponent()` | 定义组件 | `defineComponent({ name: 'MyComp', setup() {...} })` |
| `h()` | 创建虚拟 DOM | `h('div', { class: 'box' }, 'content')` |
| `render()` | 渲染到 DOM | `render(vnode, container)` |

#### Slots 插槽

| API | 说明 | 示例 |
|-----|------|------|
| `slots.default` | 默认插槽 | `slots.default?.()` |
| `slots.header` | 具名插槽 header | `slots.header?.()` |
| `slots.footer` | 具名插槽 footer | `slots.footer?.()` |

### 路由 API (@mini-fc/router)

| API | 说明 |
|-----|------|
| `createRouter()` | 创建路由实例 |
| `router.push()` | 导航到指定路径 |
| `router.replace()` | 替换当前路径 |
| `router.back()` | 返回上一页 |
| `router.beforeEach()` | 全局前置守卫 |
| `RouterView` | 路由视图组件 |

### 状态管理 API (@mini-fc/store)

| API | 说明 |
|-----|------|
| `defineStore()` | 定义 Store |
| `getStoreById()` | 通过 ID 获取 Store |
| `deleteStore()` | 删除 Store |
| `clearStores()` | 清空所有 Store |

### UI 组件 (@mini-fc/ui)

| 组件 | 说明 |
|------|------|
| `Button` | 按钮组件 |
| `Input` | 输入框组件 |
| `Select` | 选择器组件 |
| `Switch` | 开关组件 |
| `Modal` | 模态框组件 |
| `Card` | 卡片组件 |
| `List` | 列表组件 |
| `Toast` | 轻提示组件 |
| `Loading` | 加载组件 |
| `Layout` | 布局组件 |

## 🎨 主题定制

Mini-FC UI 使用 CSS 变量定义主题，你可以轻松自定义：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --font-size-base: 14px;
  --border-radius-base: 4px;
}
```

## ⚠️ 常见问题

### 1. 如何更新已安装的包？

```bash
# 更新所有 @mini-fc/* 包
npm update @mini-fc/core @mini-fc/router @mini-fc/store @mini-fc/ui

# 或更新 CLI
npm update -g @mini-fc/cli
```

### 2. 样式导入失败

**原因**：UI 包样式导入路径错误。

**解决**：
```typescript
// 正确方式
import '@mini-fc/ui/dist/style.css';
```

### 3. TypeScript 类型找不到

**解决**：确保 `tsconfig.json` 中配置了模块解析：
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

### 4. 如何查看包版本？

```bash
npm list @mini-fc/core
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](LICENSE)

---

<p align="center">Made with ❤️ by Mini-FC Team</p>
