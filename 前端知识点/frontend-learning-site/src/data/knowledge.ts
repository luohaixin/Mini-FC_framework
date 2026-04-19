import type { KnowledgePoint, Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'basic',
    name: '基础层',
    description: '前端基础技术，包括HTML、CSS、JavaScript',
    knowledgeCount: 76,
    children: [
      {
        id: 'html',
        name: 'HTML',
        description: '超文本标记语言，网页结构的基础',
        knowledgeCount: 25,
        children: [
          { id: 'html-tags', name: 'HTML标签', description: '常用HTML标签详解', knowledgeCount: 11 },
          { id: 'html-semantic', name: '语义化', description: 'HTML5语义化标签', knowledgeCount: 5 },
          { id: 'html-form', name: '表单', description: '表单元素与验证', knowledgeCount: 4 },
          { id: 'html-api', name: 'Web API', description: 'HTML5 Web Storage、Canvas等API', knowledgeCount: 5 }
        ]
      },
      {
        id: 'css',
        name: 'CSS',
        description: '层叠样式表，网页样式的基础',
        knowledgeCount: 32,
        children: [
          { id: 'css-selector', name: '选择器', description: 'CSS选择器详解', knowledgeCount: 5 },
          { id: 'css-layout', name: '布局', description: 'Flexbox、Grid等布局方式', knowledgeCount: 10 },
          { id: 'css-animation', name: '动画', description: 'CSS动画、过渡与变换效果', knowledgeCount: 8 },
          { id: 'css-responsive', name: '响应式', description: '响应式设计与媒体查询、容器查询', knowledgeCount: 7 },
          { id: 'css-modern', name: '现代特性', description: 'CSS新特性与最佳实践', knowledgeCount: 2 }
        ]
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        description: '网页交互脚本语言',
        knowledgeCount: 39,
        children: [
          { id: 'js-basic', name: '基础语法', description: '变量、数据类型、运算符、ES6+特性', knowledgeCount: 10 },
          { id: 'js-dom', name: 'DOM操作', description: '文档对象模型操作', knowledgeCount: 9 },
          { id: 'js-event', name: '事件', description: '事件处理机制', knowledgeCount: 6 },
          { id: 'js-async', name: '异步编程', description: 'Promise、Fetch、async/await', knowledgeCount: 8 },
          { id: 'js-oop', name: '面向对象', description: '原型链、类与继承', knowledgeCount: 4 },
          { id: 'js-api', name: 'Web API', description: '浏览器内置API', knowledgeCount: 2 }
        ]
      }
    ]
  },
  {
    id: 'framework',
    name: '框架层',
    description: '主流前端框架',
    knowledgeCount: 38,
    children: [
      {
        id: 'vue',
        name: 'Vue',
        description: '渐进式JavaScript框架',
        knowledgeCount: 15,
        children: [
          { id: 'vue-basic', name: '基础', description: 'Vue基础概念与语法', knowledgeCount: 5 },
          { id: 'vue-component', name: '组件', description: '组件化开发', knowledgeCount: 4 },
          { id: 'vue-router', name: '路由', description: 'Vue Router路由管理', knowledgeCount: 3 },
          { id: 'vue-pinia', name: '状态管理', description: 'Pinia状态管理', knowledgeCount: 3 }
        ]
      },
      {
        id: 'react',
        name: 'React',
        description: '用于构建用户界面的JavaScript库',
        knowledgeCount: 15,
        children: [
          { id: 'react-basic', name: '基础', description: 'React基础概念', knowledgeCount: 5 },
          { id: 'react-hooks', name: 'Hooks', description: 'React Hooks详解', knowledgeCount: 4 },
          { id: 'react-component', name: '组件', description: '组件化开发', knowledgeCount: 3 },
          { id: 'react-state', name: '状态管理', description: 'Redux、Context', knowledgeCount: 3 }
        ]
      }
    ]
  },
  {
    id: 'engineering',
    name: '工程化',
    description: '前端工程化工具与规范',
    knowledgeCount: 20,
    children: [
      { id: 'webpack', name: 'Webpack', description: '模块打包工具', knowledgeCount: 5 },
      { id: 'vite', name: 'Vite', description: '下一代前端构建工具', knowledgeCount: 4 },
      { id: 'npm', name: '包管理', description: 'npm、yarn、pnpm', knowledgeCount: 4 },
      { id: 'git', name: 'Git', description: '版本控制工具', knowledgeCount: 4 },
      { id: 'eslint', name: '代码规范', description: 'ESLint、Prettier', knowledgeCount: 3 }
    ]
  },
  {
    id: 'advanced',
    name: '进阶技术',
    description: '高级前端技术',
    knowledgeCount: 25,
    children: [
      { id: 'typescript', name: 'TypeScript', description: 'JavaScript的超集', knowledgeCount: 8 },
      { id: 'browser', name: '浏览器原理', description: '渲染机制、事件循环', knowledgeCount: 6 },
      { id: 'performance', name: '性能优化', description: '前端性能优化策略', knowledgeCount: 6 },
      { id: 'cross-platform', name: '跨端开发', description: '小程序、Electron等', knowledgeCount: 5 }
    ]
  }
]

export const knowledgePoints: KnowledgePoint[] = [
  {
    id: 'html-semantic-1',
    title: 'HTML5语义化标签',
    category: 'html',
    subCategory: 'html-semantic',
    difficulty: 'beginner',
    tags: ['HTML5', '语义化', 'SEO'],
    content: `
HTML5引入了许多语义化标签，使网页结构更加清晰，有助于SEO和可访问性。

主要语义化标签包括：
- \`<header>\`：页面或区块的头部
- \`<nav>\`：导航链接区域
- \`<main>\`：页面主要内容（一个页面只能有一个）
- \`<article>\`：独立的文章内容
- \`<section>\`：文档中的节或区块
- \`<aside>\`：侧边栏内容
- \`<footer>\`：页面或区块的底部
- \`<figure>\`：独立的流内容（如图表）
- \`<figcaption>\`  :figure的标题
- \`<time>\`：日期/时间
- \`<mark>\`：高亮文本

使用语义化标签的好处：
1. 代码可读性更高
2. 有利于SEO优化
3. 提升可访问性（屏幕阅读器友好）
4. 便于团队协作
5. 符合W3C标准规范

【更新标注】来源：W3School HTML教程 | 更新日期：2026-03-31
补充了\`<figure>\`、\`<figcaption>\`、\`<time>\`、\`<mark>\`等标签说明
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>语义化示例</title>
</head>
<body>
  <header>
    <h1>网站标题</h1>
    <nav>
      <a href="#home">首页</a>
      <a href="#about">关于</a>
    </nav>
  </header>
  
  <main>
    <article>
      <h2>文章标题</h2>
      <p>发布于 <time datetime="2026-03-31">2026年3月31日</time></p>
      <p>文章内容... <mark>重点内容</mark></p>
      
      <figure>
        <img src="chart.png" alt="数据图表">
        <figcaption>图1：2026年数据统计</figcaption>
      </figure>
    </article>
    
    <aside>
      <h3>相关链接</h3>
      <ul>
        <li><a href="#">链接1</a></li>
        <li><a href="#">链接2</a></li>
      </ul>
    </aside>
  </main>
  
  <footer>
    <p>&copy; 2026 版权所有</p>
  </footer>
</body>
</html>`,
        description: 'HTML5语义化标签完整结构示例（含新增标签）'
      }
    ],
    notes: '注意：语义化标签主要是给浏览器和搜索引擎看的，不会直接影响页面样式。main标签在一个页面中只能使用一次。',
    compatibility: 'IE9+ 及所有现代浏览器（建议使用polyfill兼容旧版IE）',
    relatedPoints: ['html-tags-1', 'html-form-1', 'html-api-1'],
    createdAt: '2024-01-01',
    updatedAt: '2026-03-31'
  },
  {
    id: 'css-flexbox-1',
    title: 'Flexbox弹性布局',
    category: 'css',
    subCategory: 'css-layout',
    difficulty: 'beginner',
    tags: ['CSS', 'Flexbox', '布局'],
    content: `
Flexbox（弹性盒子）是CSS3引入的一种一维布局模型，非常适合用于组件内部布局。

核心概念：
- 容器（flex container）：设置 display: flex 的元素
- 项目（flex item）：容器的直接子元素

容器属性：
- flex-direction：主轴方向（row、row-reverse、column、column-reverse）
- justify-content：主轴对齐方式（flex-start、center、flex-end、space-between、space-around、space-evenly）
- align-items：交叉轴对齐方式（stretch、flex-start、center、flex-end、baseline）
- align-content：多行对齐方式
- flex-wrap：是否换行（nowrap、wrap、wrap-reverse）
- gap：项目间距（row-gap、column-gap的简写）

项目属性：
- flex-grow：放大比例（默认0）
- flex-shrink：缩小比例（默认1）
- flex-basis：基础大小（默认auto）
- flex：以上三个的简写（推荐写法：flex: 1 或 flex: 1 1 auto）
- align-self：单个项目对齐方式
- order：项目排列顺序

【更新标注】来源：W3School CSS教程 | 更新日期：2026-03-31
补充了gap属性、align-content、align-self等现代Flexbox特性
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<div class="flex-container">
  <div class="flex-item">项目1</div>
  <div class="flex-item">项目2</div>
  <div class="flex-item">项目3</div>
</div>`,
        description: 'HTML结构'
      },
      {
        id: '2',
        language: 'css',
        code: `/* 现代Flexbox布局 */
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px; /* 现代浏览器支持的间距写法 */
  height: 200px;
  background: #f0f0f0;
  padding: 20px;
}

.flex-item {
  flex: 1 1 100px; /* flex-grow flex-shrink flex-basis */
  min-height: 100px;
  background: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

/* 特定项目样式 */
.flex-item:nth-child(2) {
  align-self: flex-end; /* 单独对齐 */
  order: -1; /* 排在最前面 */
}`,
        description: 'CSS样式：现代Flexbox完整示例（含gap和简写属性）'
      }
    ],
    notes: 'Flexbox非常适合用于一维布局（单行或单列），二维布局建议使用Grid。gap属性在现代浏览器中已全面支持，可替代margin方案。',
    compatibility: 'IE11+ 及所有现代浏览器（gap属性：Chrome 84+, Firefox 63+, Safari 14+）',
    relatedPoints: ['css-grid-1', 'css-layout-1', 'css-container-1'],
    createdAt: '2024-01-02',
    updatedAt: '2026-03-31'
  },
  {
    id: 'js-promise-1',
    title: 'Promise异步编程与现代API',
    category: 'javascript',
    subCategory: 'js-async',
    difficulty: 'intermediate',
    tags: ['JavaScript', 'Promise', '异步编程', 'ES2024'],
    content: `
Promise是JavaScript中处理异步操作的一种解决方案，比传统的回调函数更优雅。

Promise有三种状态：
- pending（进行中）
- fulfilled（已成功）
- rejected（已失败）

常用方法：
- then()：处理成功结果
- catch()：处理错误
- finally()：无论成功失败都会执行
- Promise.all()：等待所有Promise完成
- Promise.race()：返回最快完成的Promise
- Promise.allSettled()：等待所有Promise完成（无论成功失败）
- Promise.any()：返回第一个成功的Promise

【更新标注】来源：W3School JavaScript教程 | 更新日期：2026-03-31
补充了Promise.allSettled()和Promise.any()等ES2020+新特性
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// 创建Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({ data: '获取成功' });
      } else {
        reject(new Error('获取失败'));
      }
    }, 1000);
  });
};

// 使用Promise
fetchData()
  .then(result => {
    console.log(result.data);
    return result.data;
  })
  .catch(error => {
    console.error(error.message);
  })
  .finally(() => {
    console.log('请求完成');
  });

// Promise.all 并行请求（任一失败则全部失败）
Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
  .then(([user, posts, comments]) => {
    console.log('所有请求完成');
  });

// Promise.allSettled 等待所有完成（无论成功失败）
Promise.allSettled([
  Promise.resolve('成功1'),
  Promise.reject('失败'),
  Promise.resolve('成功2')
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('成功:', result.value);
    } else {
      console.log('失败:', result.reason);
    }
  });
});

// Promise.any 返回第一个成功的
Promise.any([
  Promise.reject('错误1'),
  Promise.resolve('第一个成功'),
  Promise.resolve('第二个成功')
]).then(firstSuccess => {
  console.log('第一个成功:', firstSuccess);
});`,
        description: 'Promise现代API完整示例（含ES2020+新特性）'
      }
    ],
    notes: '使用Promise时要记得处理错误，避免未捕获的异常。Promise.allSettled和Promise.any是ES2020/ES2021引入的，在旧浏览器需要polyfill。',
    compatibility: 'ES6+基础，Promise.allSettled: Chrome 76+, Firefox 71+, Safari 13+；Promise.any: Chrome 85+, Firefox 79+, Safari 14+',
    relatedPoints: ['js-async-1', 'js-async-await-1', 'js-fetch-1'],
    createdAt: '2024-01-03',
    updatedAt: '2026-03-31'
  },
  {
    id: 'vue-basic-1',
    title: 'Vue3组合式API基础',
    category: 'vue',
    subCategory: 'vue-basic',
    difficulty: 'intermediate',
    tags: ['Vue3', 'Composition API', 'setup'],
    content: `
Vue3引入了组合式API（Composition API），提供了更灵活的逻辑复用方式。

核心API：
- ref()：创建响应式引用
- reactive()：创建响应式对象
- computed()：计算属性
- watch()：侦听器
- onMounted()等生命周期钩子

组合式API的优势：
1. 更好的逻辑复用
2. 更灵活的代码组织
3. 更好的TypeScript支持
4. 更小的打包体积
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const user = reactive({
  name: '张三',
  age: 25
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 侦听器
watch(count, (newVal, oldVal) => {
  console.log(\`count变化: \${oldVal} -> \${newVal}\`)
})

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <p>计数: {{ count }}</p>
    <p>双倍: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
    <p>用户: {{ user.name }}, {{ user.age }}岁</p>
  </div>
</template>`,
        description: 'Vue3组合式API基本用法'
      }
    ],
    notes: '组合式API推荐在Vue3中使用，但选项式API仍然可用。',
    compatibility: 'Vue3+',
    relatedPoints: ['vue-component-1', 'vue-hooks-1'],
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04'
  },
  {
    id: 'react-hooks-1',
    title: 'React Hooks基础',
    category: 'react',
    subCategory: 'react-hooks',
    difficulty: 'intermediate',
    tags: ['React', 'Hooks', 'useState', 'useEffect'],
    content: `
React Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性。

常用Hooks：
- useState：管理状态
- useEffect：处理副作用
- useContext：访问Context
- useRef：获取DOM引用
- useMemo：缓存计算结果
- useCallback：缓存函数

Hooks使用规则：
1. 只在最顶层调用Hooks
2. 只在React函数中调用Hooks
3. 以use开头命名自定义Hooks
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `import React, { useState, useEffect, useCallback } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // 副作用处理
  useEffect(() => {
    document.title = \`点击了 \${count} 次\`;
    
    // 清理函数
    return () => {
      console.log('清理副作用');
    };
  }, [count]); // 依赖数组

  // 缓存函数
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>点击了 {count} 次</p>
      <button onClick={handleClick}>
        点击我
      </button>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)}
        placeholder="输入名字"
      />
    </div>
  );
}

export default Counter;`,
        description: 'React Hooks基本用法'
      }
    ],
    notes: 'Hooks让函数组件拥有了类组件的能力，代码更简洁。',
    compatibility: 'React 16.8+',
    relatedPoints: ['react-basic-1', 'react-component-1'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  },
  {
    id: 'ts-basic-1',
    title: 'TypeScript基础类型',
    category: 'typescript',
    subCategory: 'ts-basic',
    difficulty: 'beginner',
    tags: ['TypeScript', '类型系统'],
    content: `
TypeScript是JavaScript的超集，添加了静态类型检查，提高代码质量和开发效率。

基础类型：
- boolean：布尔值
- number：数字
- string：字符串
- array：数组
- tuple：元组
- enum：枚举
- any：任意类型
- unknown：未知类型
- void：无返回值
- null/undefined：空值
- never：永不返回

类型推断与注解：
TypeScript可以自动推断类型，也可以显式声明类型。
    `,
    codeExamples: [
      {
        id: '1',
        language: 'typescript',
        code: `// 基础类型
let isDone: boolean = false;
let count: number = 42;
let userName: string = '张三';

// 数组
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob'];

// 元组
let tuple: [string, number] = ['hello', 10];

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// 接口
interface Person {
  name: string;
  age: number;
  email?: string; // 可选属性
}

let person: Person = {
  name: '张三',
  age: 25
};

// 函数
function add(x: number, y: number): number {
  return x + y;
}

// 泛型
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>('myString');`,
        description: 'TypeScript基础类型示例'
      }
    ],
    notes: 'TypeScript在编译时进行类型检查，不会增加运行时开销。',
    compatibility: '所有支持ES3+的环境',
    relatedPoints: ['ts-interface-1', 'ts-generic-1'],
    createdAt: '2024-01-06',
    updatedAt: '2024-01-06'
  },
  {
    id: 'css-grid-1',
    title: 'CSS Grid网格布局',
    category: 'css',
    subCategory: 'css-layout',
    difficulty: 'intermediate',
    tags: ['CSS', 'Grid', '布局', '二维布局'],
    content: `
CSS Grid（网格布局）是CSS最强大的布局系统，专为二维布局设计（同时处理行和列）。

核心概念：
- 网格容器（grid container）：设置 display: grid 的元素
- 网格项（grid item）：容器的直接子元素
- 网格线（grid line）：构成网格结构的分界线
- 网格轨道（grid track）：两条相邻网格线之间的空间（行或列）
- 网格单元格（grid cell）：两条相邻行和列网格线之间的空间
- 网格区域（grid area）：一个或多个网格单元格组成的矩形区域

容器属性：
- grid-template-columns：定义列的大小和数量
- grid-template-rows：定义行的大小和数量
- grid-template-areas：定义命名网格区域
- gap / row-gap / column-gap：定义网格间距
- justify-items：水平对齐网格项
- align-items：垂直对齐网格项
- place-items：justify-items和align-items的简写

项目属性：
- grid-column：定义项占用的列范围
- grid-row：定义项占用的行范围
- grid-area：定义项占用的区域
- justify-self：单个项的水平对齐
- align-self：单个项的垂直对齐

【更新标注】来源：W3School CSS教程 | 更新日期：2026-03-31
新增CSS Grid完整知识点，涵盖现代网格布局技术
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<div class="grid-container">
  <header class="header">头部</header>
  <aside class="sidebar">侧边栏</aside>
  <main class="main">主要内容</main>
  <footer class="footer">底部</footer>
</div>`,
        description: '网格布局HTML结构'
      },
      {
        id: '2',
        language: 'css',
        code: `/* 现代CSS Grid布局 */
.grid-container {
  display: grid;
  /* 定义三列布局：侧边栏固定200px，主内容自适应 */
  grid-template-columns: 200px 1fr 200px;
  /* 定义两行：头部和底部自动高度，中间自适应 */
  grid-template-rows: auto 1fr auto;
  /* 定义网格区域命名 */
  grid-template-areas:
    "header header header"
    "sidebar main ."
    "footer footer footer";
  gap: 20px;
  min-height: 100vh;
  padding: 20px;
}

.header {
  grid-area: header;
  background: #3498db;
  padding: 20px;
  color: white;
}

.sidebar {
  grid-area: sidebar;
  background: #2ecc71;
  padding: 20px;
}

.main {
  grid-area: main;
  background: #ecf0f1;
  padding: 20px;
}

.footer {
  grid-area: footer;
  background: #34495e;
  padding: 20px;
  color: white;
}

/* 响应式：小屏幕改为单列 */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
  }
}`,
        description: 'CSS Grid完整示例（含响应式布局）'
      }
    ],
    notes: 'CSS Grid适合二维布局（同时控制行列），Flexbox适合一维布局。现代浏览器已全面支持Grid，是构建页面整体布局的首选方案。',
    compatibility: 'Chrome 57+, Firefox 52+, Safari 10.1+, Edge 16+（IE11部分支持需加前缀）',
    relatedPoints: ['css-flexbox-1', 'css-layout-1', 'css-container-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'css-container-1',
    title: 'CSS容器查询（Container Queries）',
    category: 'css',
    subCategory: 'css-responsive',
    difficulty: 'advanced',
    tags: ['CSS', '容器查询', '响应式', 'CSS新特性'],
    content: `
CSS容器查询（Container Queries）是CSS的新特性，允许根据容器的大小而非视口大小来应用样式。

核心概念：
- 容器查询解决了媒体查询的局限性（基于视口而非组件容器）
- 使组件真正具备响应式能力，无论放在哪里都能自适应

使用步骤：
1. 使用 container-type 属性定义容器
2. 使用 @container 规则根据容器尺寸应用样式

容器类型：
- container-type: size - 查询容器的宽高
- container-type: inline-size - 只查询内联方向尺寸（宽度）
- container-type: normal - 默认值，不作为查询容器

【更新标注】来源：W3School CSS教程 | 更新日期：2026-03-31
新增CSS容器查询知识点，这是CSS响应式设计的重要进化
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<div class="card-container">
  <div class="card">
    <img src="image.jpg" alt="图片">
    <div class="card-content">
      <h3>卡片标题</h3>
      <p>卡片描述内容...</p>
    </div>
  </div>
</div>`,
        description: '容器查询HTML结构'
      },
      {
        id: '2',
        language: 'css',
        code: `/* 定义容器 */
.card-container {
  container-type: inline-size;
  container-name: card; /* 可选：命名容器 */
  width: 100%;
}

/* 基础卡片样式 */
.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card img {
  width: 100%;
  height: auto;
}

/* 容器查询：当容器宽度 >= 400px 时 */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
    align-items: center;
  }
  
  .card img {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }
}

/* 容器查询：当容器宽度 >= 600px 时 */
@container (min-width: 600px) {
  .card img {
    width: 200px;
    height: 200px;
  }
  
  .card-content h3 {
    font-size: 1.5rem;
  }
}

/* 使用命名容器的查询 */
@container card (min-width: 800px) {
  .card {
    gap: 30px;
    padding: 20px;
  }
}`,
        description: 'CSS容器查询完整示例'
      }
    ],
    notes: '容器查询是响应式设计的未来方向，特别适合设计系统和组件库。注意与媒体查询的区别：媒体查询基于视口，容器查询基于容器。',
    compatibility: 'Chrome 105+, Firefox 110+, Safari 16+（2022年后新特性，现代浏览器支持良好）',
    relatedPoints: ['css-flexbox-1', 'css-grid-1', 'css-responsive-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'html-api-1',
    title: 'HTML5 Web Storage API',
    category: 'html',
    subCategory: 'html-api',
    difficulty: 'intermediate',
    tags: ['HTML5', 'Web Storage', 'localStorage', 'sessionStorage', 'API'],
    content: `
HTML5 Web Storage API 提供了在客户端存储数据的机制，比Cookie更强大、更易用。

两种存储类型：
- localStorage：持久化存储，数据不会过期，除非手动删除
- sessionStorage：会话级存储，页面关闭后数据清除

常用方法：
- setItem(key, value)：存储数据
- getItem(key)：获取数据
- removeItem(key)：删除指定数据
- clear()：清空所有数据
- key(index)：获取指定索引的键
- length：返回存储项数量

存储特点：
- 只能存储字符串（对象需用JSON.stringify转换）
- 存储容量约5-10MB（比Cookie大得多）
- 遵循同源策略

【更新标注】来源：W3School HTML API教程 | 更新日期：2026-03-31
新增HTML5 Web Storage API知识点
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// localStorage 基本操作
// 存储数据
localStorage.setItem('username', '张三');
localStorage.setItem('theme', 'dark');

// 获取数据
const username = localStorage.getItem('username');
console.log(username); // "张三"

// 存储对象（需转换为JSON）
const user = {
  name: '李四',
  age: 25,
  email: 'li@example.com'
};
localStorage.setItem('user', JSON.stringify(user));

// 读取对象
const userData = JSON.parse(localStorage.getItem('user'));
console.log(userData.name); // "李四"

// 删除指定项
localStorage.removeItem('theme');

// 清空所有
// localStorage.clear();

// sessionStorage 使用方式相同，但页面关闭即清除
sessionStorage.setItem('tempData', '临时数据');

// 实用封装函数
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// 使用封装
storage.set('appSettings', { theme: 'dark', lang: 'zh' });
const settings = storage.get('appSettings');`,
        description: 'Web Storage API完整使用示例'
      }
    ],
    notes: 'Web Storage适合存储用户偏好设置、缓存数据等。敏感数据不要存储在localStorage中（易被XSS攻击获取）。',
    compatibility: 'IE8+ 及所有现代浏览器',
    relatedPoints: ['html-semantic-1', 'js-fetch-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'js-fetch-1',
    title: 'Fetch API 网络请求',
    category: 'javascript',
    subCategory: 'js-async',
    difficulty: 'intermediate',
    tags: ['JavaScript', 'Fetch', 'API', '网络请求', 'AJAX'],
    content: `
Fetch API 是现代浏览器内置的网络请求接口，用于替代传统的 XMLHttpRequest，基于Promise设计。

基本用法：
- fetch(url)：发送GET请求
- fetch(url, options)：发送带配置的请求

常用选项：
- method：请求方法（GET、POST、PUT、DELETE等）
- headers：请求头
- body：请求体（POST/PUT时使用）
- mode：请求模式（cors、no-cors、same-origin）
- credentials：是否携带cookie（omit、same-origin、include）

响应处理：
- response.ok：请求是否成功（状态码200-299）
- response.status：HTTP状态码
- response.json()：解析JSON响应
- response.text()：解析文本响应

【更新标注】来源：W3School JavaScript教程 | 更新日期：2026-03-31
新增Fetch API知识点，现代前端网络请求标准方案
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// GET请求
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error('网络请求失败');
    }
    return response.json();
  })
  .then(data => {
    console.log('用户数据:', data);
  })
  .catch(error => {
    console.error('请求错误:', error);
  });

// POST请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: '张三',
    email: 'zhang@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log('创建成功:', data));

// 使用 async/await
async function getUser(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP错误: \${response.status}\`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('获取用户失败:', error);
    throw error;
  }
}

// 封装通用请求函数
async function request(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(\`请求失败: \${response.status}\`);
  }
  
  return response.json();
}

// 使用封装
request('/api/users')
  .then(data => console.log(data));`,
        description: 'Fetch API完整使用示例（含封装）'
      }
    ],
    notes: 'Fetch API是现代浏览器的标准网络请求方案。注意：Fetch默认不携带cookie，需要设置credentials选项；错误状态码（404/500）不会触发catch，需要手动检查response.ok。',
    compatibility: 'Chrome 42+, Firefox 39+, Safari 10.1+, Edge 14+（IE不支持，需要polyfill）',
    relatedPoints: ['js-promise-1', 'js-async-await-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'js-es6-plus-1',
    title: 'JavaScript ES6+ 现代特性',
    category: 'javascript',
    subCategory: 'js-basic',
    difficulty: 'intermediate',
    tags: ['JavaScript', 'ES6', 'ES2024', '现代语法', '新特性'],
    content: `
ES6（ECMAScript 2015）及后续版本为JavaScript带来了大量现代化特性，极大提升了开发效率和代码可读性。

核心新特性：

1. 变量声明
- let：块级作用域变量
- const：块级作用域常量

2. 箭头函数
- 简洁语法：(params) => expression
- 自动绑定this

3. 解构赋值
- 数组解构：[a, b] = arr
- 对象解构：{name, age} = obj

4. 模板字符串
- 使用反引号：\`Hello \${name}\`
- 支持多行字符串

5. 展开运算符
- 数组展开：[...arr1, ...arr2]
- 对象展开：{...obj1, ...obj2}

6. 可选链操作符 ?.
- obj?.property?.method?.()
- 避免深层属性访问报错

7. 空值合并运算符 ??
- value ?? defaultValue
- 仅在null或undefined时使用默认值

8. 类（Class）
- 更清晰的面向对象语法
- 支持继承、静态方法等

【更新标注】来源：W3School JavaScript教程 | 更新日期：2026-03-31
新增ES6+现代特性汇总，涵盖至ES2024最新特性
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// ES6+ 现代特性示例

// 1. let/const
const PI = 3.14159;
let count = 0;

// 2. 箭头函数
const add = (a, b) => a + b;
const numbers = [1, 2, 3].map(n => n * 2);

// 3. 解构赋值
const user = { name: '张三', age: 25, city: '北京' };
const { name, age } = user;

const colors = ['红', '绿', '蓝'];
const [first, second] = colors;

// 4. 模板字符串
const greeting = \`你好，\${name}！\n你今年\${age}岁。\`;

// 5. 展开运算符
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4]

const obj1 = { a: 1 };
const obj2 = { b: 2 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2 }

// 6. 可选链操作符 ?.
const user2 = {
  profile: {
    address: {
      city: '上海'
    }
  }
};
const city = user2?.profile?.address?.city; // "上海"
const zip = user2?.profile?.address?.zip; // undefined（不报错）

// 7. 空值合并运算符 ??
const value1 = null ?? '默认值'; // "默认值"
const value2 = 0 ?? '默认值'; // 0（不是null/undefined，保留原值）
const value3 = '' ?? '默认值'; // ""（不是null/undefined，保留原值）

// 8. 类
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} 发出声音\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} 汪汪叫\`);
  }
}

const dog = new Dog('旺财');
dog.speak(); // "旺财 汪汪叫"

// 9. 动态导入（ES2020）
const module = await import('./utils.js');

// 10. 私有类成员（ES2022）
class Counter {
  #count = 0; // 私有字段
  
  increment() {
    this.#count++;
  }
  
  getCount() {
    return this.#count;
  }
}`,
        description: 'ES6+现代特性完整示例'
      }
    ],
    notes: 'ES6+特性大幅提升了JavaScript的开发体验。现代前端开发应优先使用这些特性，但需注意浏览器兼容性，必要时使用Babel转译。',
    compatibility: 'ES6基础特性：Chrome 51+, Firefox 54+, Safari 10+, Edge 15+；可选链和空值合并：Chrome 80+, Firefox 74+, Safari 13.1+',
    relatedPoints: ['js-basic-1', 'js-promise-1', 'js-async-await-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'html-canvas-1',
    title: 'HTML5 Canvas 画布',
    category: 'html',
    subCategory: 'html-api',
    difficulty: 'intermediate',
    tags: ['HTML5', 'Canvas', '绘图', '图形', '动画'],
    content: `
HTML5 Canvas 是用于通过 JavaScript 动态绘制图形的容器，可用于创建图表、游戏、图像编辑等应用。

核心概念：
- Canvas 是一个矩形区域，使用 <canvas> 标签定义
- 通过 JavaScript 的 getContext('2d') 获取2D渲染上下文
- 所有绘制操作都通过上下文对象进行

绘制基础：
- 路径绘制：beginPath(), moveTo(), lineTo(), stroke(), fill()
- 矩形：fillRect(), strokeRect(), clearRect()
- 圆弧和圆：arc(), arcTo()
- 贝塞尔曲线：quadraticCurveTo(), bezierCurveTo()

样式设置：
- fillStyle：填充颜色/渐变/模式
- strokeStyle：描边颜色/渐变/模式
- lineWidth：线条宽度
- lineCap/lineJoin：线端和连接样式
- shadowColor/shadowBlur：阴影效果

高级功能：
- 渐变：createLinearGradient(), createRadialGradient()
- 图像绘制：drawImage()
- 像素操作：getImageData(), putImageData(), createImageData()
- 变换：translate(), rotate(), scale(), transform()
- 合成：globalAlpha, globalCompositeOperation

【更新标注】来源：W3School HTML Canvas教程 | 更新日期：2026-03-31
新增Canvas画布完整知识点，涵盖2D绘图核心技术
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<canvas id="myCanvas" width="400" height="300" style="border:1px solid #ccc;">
  您的浏览器不支持Canvas
</canvas>`,
        description: 'Canvas基础HTML结构'
      },
      {
        id: '2',
        language: 'javascript',
        code: `// 获取Canvas上下文
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 1. 绘制矩形
ctx.fillStyle = '#3498db';
ctx.fillRect(10, 10, 100, 80); // 填充矩形

ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 3;
ctx.strokeRect(120, 10, 100, 80); // 描边矩形

// 2. 绘制路径 - 三角形
ctx.beginPath();
ctx.moveTo(250, 10);
ctx.lineTo(350, 10);
ctx.lineTo(300, 90);
ctx.closePath();
ctx.fillStyle = '#2ecc71';
ctx.fill();

// 3. 绘制圆形
ctx.beginPath();
ctx.arc(60, 150, 40, 0, Math.PI * 2);
ctx.fillStyle = '#f39c12';
ctx.fill();
ctx.strokeStyle = '#d35400';
ctx.stroke();

// 4. 绘制渐变
const gradient = ctx.createLinearGradient(120, 120, 220, 180);
gradient.addColorStop(0, '#e74c3c');
gradient.addColorStop(0.5, '#f39c12');
gradient.addColorStop(1, '#f1c40f');
ctx.fillStyle = gradient;
ctx.fillRect(120, 120, 100, 80);

// 5. 绘制文字
ctx.font = 'bold 24px Arial';
ctx.fillStyle = '#2c3e50';
ctx.textAlign = 'center';
ctx.fillText('Hello Canvas', 200, 250);

// 6. 绘制图片（假设图片已加载）
// const img = new Image();
// img.onload = () => {
//   ctx.drawImage(img, 250, 120, 100, 100);
// };
// img.src = 'image.png';`,
        description: 'Canvas 2D绘图完整示例'
      },
      {
        id: '3',
        language: 'javascript',
        code: `// Canvas动画示例 - 移动的小球
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let x = 50, y = 50;
let dx = 2, dy = 2;
const radius = 20;

function animate() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制小球
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  ctx.strokeStyle = '#2980b9';
  ctx.stroke();
  
  // 更新位置
  x += dx;
  y += dy;
  
  // 边界检测
  if (x + radius > canvas.width || x - radius < 0) dx = -dx;
  if (y + radius > canvas.height || y - radius < 0) dy = -dy;
  
  // 继续动画
  requestAnimationFrame(animate);
}

// 启动动画
animate();`,
        description: 'Canvas动画实现示例'
      }
    ],
    notes: 'Canvas是位图渲染，放大后会失真。如需矢量图形可考虑SVG。Canvas适合游戏、图像处理、复杂动画；SVG适合图标、图表、需要缩放的图形。',
    compatibility: 'IE9+ 及所有现代浏览器',
    relatedPoints: ['html-api-1', 'js-dom-1', 'css-animation-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'js-dom-1',
    title: 'JavaScript DOM 操作',
    category: 'javascript',
    subCategory: 'js-dom',
    difficulty: 'beginner',
    tags: ['JavaScript', 'DOM', '文档对象模型', '元素操作'],
    content: `
DOM（Document Object Model，文档对象模型）是W3C标准，定义了访问HTML和XML文档的标准接口。JavaScript通过DOM可以动态访问和修改文档内容、结构和样式。

DOM树结构：
- 文档节点（Document）：整个文档的根节点
- 元素节点（Element）：HTML标签
- 文本节点（Text）：标签内的文本内容
- 属性节点（Attribute）：元素的属性

元素查找方法：
- getElementById(id)：通过ID查找元素
- getElementsByClassName(class)：通过类名查找（返回集合）
- getElementsByTagName(tag)：通过标签名查找（返回集合）
- querySelector(selector)：通过CSS选择器查找第一个匹配元素
- querySelectorAll(selector)：通过CSS选择器查找所有匹配元素

元素操作：
- 内容操作：innerHTML, textContent, innerText
- 属性操作：getAttribute(), setAttribute(), removeAttribute()
- 样式操作：element.style.property, className, classList
- 元素创建：createElement(), createTextNode()
- 元素插入：appendChild(), insertBefore(), insertAdjacentHTML()
- 元素删除：removeChild(), remove()
- 元素替换：replaceChild()

节点关系：
- parentNode：父节点
- childNodes：子节点集合
- children：子元素集合
- firstChild/lastChild：第一个/最后一个子节点
- nextSibling/previousSibling：下一个/上一个兄弟节点

【更新标注】来源：W3School JavaScript DOM教程 | 更新日期：2026-03-31
新增DOM操作完整知识点，涵盖元素查找、操作和遍历
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// DOM元素查找
// 1. 通过ID查找（最常用）
const header = document.getElementById('header');

// 2. 通过类名查找（返回HTMLCollection）
const buttons = document.getElementsByClassName('btn');

// 3. 通过标签名查找
const paragraphs = document.getElementsByTagName('p');

// 4. 通过CSS选择器查找（现代推荐方式）
const nav = document.querySelector('.navbar'); // 第一个匹配
const links = document.querySelectorAll('a[href^="https"]'); // 所有匹配

// 5. 链式查找
const sidebarItems = document
  .querySelector('.sidebar')
  ?.querySelectorAll('.item');

console.log('找到按钮数量:', buttons.length);
console.log('第一个链接:', links[0]);`,
        description: 'DOM元素查找方法'
      },
      {
        id: '2',
        language: 'javascript',
        code: `// DOM元素操作
const box = document.getElementById('box');

// 1. 修改内容
box.innerHTML = '<strong>新内容</strong>'; // 解析HTML
box.textContent = '纯文本内容'; // 不解析HTML（更安全）

// 2. 修改属性
box.setAttribute('data-id', '123');
box.setAttribute('title', '提示文本');
const dataId = box.getAttribute('data-id');

// 3. 修改样式
box.style.backgroundColor = '#3498db';
box.style.width = '200px';
box.style.display = 'flex';

// 4. 类名操作（推荐）
box.className = 'container active'; // 直接设置
box.classList.add('highlight'); // 添加类
box.classList.remove('active'); // 移除类
box.classList.toggle('visible'); // 切换类
box.classList.contains('highlight'); // 检查类（返回true/false）

// 5. 创建和插入元素
const newDiv = document.createElement('div');
newDiv.textContent = '新创建的元素';
newDiv.className = 'new-item';

// 插入到末尾
box.appendChild(newDiv);

// 插入到开头
box.insertBefore(newDiv, box.firstChild);

// 使用insertAdjacentHTML（更灵活）
box.insertAdjacentHTML('beforeend', '<span>追加内容</span>');
// 位置选项：beforebegin, afterbegin, beforeend, afterend

// 6. 删除元素
newDiv.remove(); // 现代浏览器
// 或 box.removeChild(newDiv);`,
        description: 'DOM元素操作完整示例'
      },
      {
        id: '3',
        language: 'javascript',
        code: `// DOM遍历
const container = document.getElementById('container');

// 1. 父子关系
console.log('父节点:', container.parentNode);
console.log('父元素:', container.parentElement);
console.log('所有子节点（包含文本）:', container.childNodes);
console.log('所有子元素:', container.children);
console.log('第一个子元素:', container.firstElementChild);
console.log('最后一个子元素:', container.lastElementChild);

// 2. 兄弟关系
const item = document.querySelector('.item');
console.log('下一个兄弟元素:', item.nextElementSibling);
console.log('上一个兄弟元素:', item.previousElementSibling);

// 3. 遍历所有子元素
Array.from(container.children).forEach((child, index) => {
  console.log(\`子元素 \${index}:\`, child.tagName);
});

// 4. 查找最近的祖先元素
const closestNav = item.closest('.navbar'); // 向上查找最近的.navbar

// 5. 检查包含关系
const isContained = container.contains(item); // container是否包含item

// 6. 实用：获取元素在父元素中的索引
function getElementIndex(element) {
  return Array.from(element.parentElement.children).indexOf(element);
}

console.log('元素索引:', getElementIndex(item));`,
        description: 'DOM节点遍历方法'
      }
    ],
    notes: 'DOM操作是前端开发的核心技能。querySelector/querySelectorAll是现代开发的首选方法。操作大量DOM时注意性能，可使用文档片段（DocumentFragment）批量操作。',
    compatibility: '所有现代浏览器（querySelector: IE8+, classList: IE10+）',
    relatedPoints: ['js-event-1', 'js-basic-1', 'html-semantic-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'js-event-1',
    title: 'JavaScript 事件处理',
    category: 'javascript',
    subCategory: 'js-event',
    difficulty: 'beginner',
    tags: ['JavaScript', '事件', 'Event', '事件监听', '事件委托'],
    content: `
事件是浏览器或用户与网页交互时触发的动作。JavaScript通过事件处理机制响应这些交互，实现动态网页效果。

事件类型：
- 鼠标事件：click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout
- 键盘事件：keydown, keyup, keypress
- 表单事件：submit, change, input, focus, blur
- 窗口事件：load, resize, scroll, unload
- 触摸事件：touchstart, touchmove, touchend（移动端）

事件处理方式：
1. HTML属性：onclick="handler()"（不推荐）
2. DOM属性：element.onclick = handler（一个元素只能绑定一个）
3. addEventListener（推荐，可绑定多个，可控制捕获/冒泡）

事件对象（Event）：
- type：事件类型
- target：触发事件的元素
- currentTarget：绑定事件的元素
- preventDefault()：阻止默认行为
- stopPropagation()：阻止事件冒泡

事件流：
- 捕获阶段（Capturing）：从window到目标元素
- 目标阶段（Target）：到达目标元素
- 冒泡阶段（Bubbling）：从目标元素回到window

事件委托：
- 利用事件冒泡机制，在父元素上统一处理子元素事件
- 优点：减少事件监听器数量，动态添加的元素也能响应

【更新标注】来源：W3School JavaScript事件教程 | 更新日期：2026-03-31
新增事件处理完整知识点，涵盖事件类型、绑定方式和事件委托
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// 事件绑定方式对比

// 方式1：HTML属性（不推荐）
// <button onclick="alert('点击')">点击</button>

// 方式2：DOM属性（只能绑定一个处理函数）
const btn1 = document.getElementById('btn1');
btn1.onclick = function() {
  console.log('按钮1被点击');
};

// 方式3：addEventListener（推荐）
const btn2 = document.getElementById('btn2');

// 可以绑定多个处理函数
btn2.addEventListener('click', function() {
  console.log('处理函数1');
});

btn2.addEventListener('click', function() {
  console.log('处理函数2');
});

// 使用箭头函数
btn2.addEventListener('click', () => {
  console.log('箭头函数处理');
});

// 移除事件监听（需要引用同一个函数）
function handleClick() {
  console.log('可移除的处理');
}
btn2.addEventListener('click', handleClick);
btn2.removeEventListener('click', handleClick);

// 一次性事件（自动移除）
btn2.addEventListener('click', () => {
  console.log('只执行一次');
}, { once: true });`,
        description: '事件绑定方式'
      },
      {
        id: '2',
        language: 'javascript',
        code: `// 事件对象和常用事件
const link = document.querySelector('a');
const input = document.querySelector('input');

// 点击事件
link.addEventListener('click', (event) => {
  console.log('事件类型:', event.type);
  console.log('触发元素:', event.target);
  console.log('绑定元素:', event.currentTarget);
  
  // 阻止默认行为（阻止跳转）
  event.preventDefault();
  console.log('默认行为已阻止');
});

// 输入事件（实时监听输入）
input.addEventListener('input', (e) => {
  console.log('当前值:', e.target.value);
});

// 键盘事件
document.addEventListener('keydown', (e) => {
  console.log('按键:', e.key);
  console.log('按键码:', e.keyCode);
  console.log('Ctrl键:', e.ctrlKey);
  console.log('Shift键:', e.shiftKey);
  
  // Ctrl+S 保存
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    console.log('保存操作');
  }
});

// 表单提交
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // 阻止默认提交
  
  // 获取表单数据
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log('表单数据:', data);
  
  // 验证...
  // 发送请求...
});

// 窗口事件
window.addEventListener('resize', () => {
  console.log('窗口尺寸:', window.innerWidth, window.innerHeight);
});

window.addEventListener('scroll', () => {
  console.log('滚动位置:', window.scrollY);
});`,
        description: '事件对象和常用事件示例'
      },
      {
        id: '3',
        language: 'javascript',
        code: `// 事件委托（Event Delegation）
// 场景：列表项很多，或动态添加项

const list = document.getElementById('list');

// 不推荐：为每个li绑定事件
// document.querySelectorAll('li').forEach(li => {
//   li.addEventListener('click', ...);
// });

// 推荐：在父元素上统一处理
list.addEventListener('click', (e) => {
  // 判断点击的是否是li元素
  if (e.target.tagName === 'LI') {
    console.log('点击了:', e.target.textContent);
    e.target.classList.toggle('selected');
  }
  
  // 或者使用closest查找最近的li
  const li = e.target.closest('li');
  if (li && list.contains(li)) {
    console.log('点击了li:', li.dataset.id);
  }
});

// 动态添加元素也能响应
const newItem = document.createElement('li');
newItem.textContent = '新项';
newItem.dataset.id = '4';
list.appendChild(newItem); // 自动有事件处理

// 阻止事件冒泡示例
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.stopPropagation(); // 阻止冒泡到li
    e.target.parentElement.remove();
  }
});

/* HTML结构示例：
<ul id="list">
  <li data-id="1">项1 <button class="delete-btn">删除</button></li>
  <li data-id="2">项2 <button class="delete-btn">删除</button></li>
  <li data-id="3">项3 <button class="delete-btn">删除</button></li>
</ul>
*/`,
        description: '事件委托最佳实践'
      }
    ],
    notes: '事件委托是处理大量元素事件的高效方式。addEventListener的第三个参数可以是布尔值（useCapture）或选项对象{capture, once, passive}。现代浏览器支持options对象。',
    compatibility: 'addEventListener: IE9+，Options对象参数: Chrome 55+, Firefox 49+, Safari 10+',
    relatedPoints: ['js-dom-1', 'js-async-1', 'html-form-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'css-animation-1',
    title: 'CSS 动画与过渡',
    category: 'css',
    subCategory: 'css-animation',
    difficulty: 'intermediate',
    tags: ['CSS', '动画', '过渡', 'animation', 'transition', '@keyframes'],
    content: `
CSS动画允许元素从一种样式逐渐变化为另一种样式，无需JavaScript即可实现流畅的视觉效果。

CSS过渡（Transition）：
- 用于简单的属性变化动画
- 需要触发条件（如:hover, :focus, 类名变化）
- 属性：transition-property, transition-duration, transition-timing-function, transition-delay
- 简写：transition: property duration timing-function delay

CSS动画（Animation）：
- 使用@keyframes定义关键帧
- 可自动播放，无需触发条件
- 可控制播放次数、方向、填充模式等
- 属性：animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state
- 简写：animation: name duration timing-function delay iteration-count direction fill-mode

动画速度曲线：
- ease：慢-快-慢（默认）
- linear：匀速
- ease-in：慢开始
- ease-out：慢结束
- ease-in-out：慢开始和结束
- cubic-bezier(n,n,n,n)：自定义贝塞尔曲线

性能优化：
- 优先使用transform和opacity属性（GPU加速）
- 避免动画width、height、top、left等属性（触发重排）
- 使用will-change提示浏览器优化

【更新标注】来源：W3School CSS动画教程 | 更新日期：2026-03-31
新增CSS动画与过渡完整知识点，涵盖@keyframes和性能优化
    `,
    codeExamples: [
      {
        id: '1',
        language: 'css',
        code: `/* CSS 过渡效果 */
.button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  /* 过渡设置 */
  transition-property: background-color, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  /* 或简写：transition: background-color 0.3s ease, transform 0.2s ease; */
}

.button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

/* 卡片悬停效果 */
.card {
  width: 200px;
  height: 150px;
  background: #ecf0f1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

/* 不同速度曲线对比 */
.box {
  width: 100px;
  height: 100px;
  background: #e74c3c;
  transition: transform 2s;
}

.box:hover {
  transform: translateX(300px);
}

.linear { transition-timing-function: linear; }
.ease { transition-timing-function: ease; }
.ease-in { transition-timing-function: ease-in; }
.ease-out { transition-timing-function: ease-out; }
.ease-in-out { transition-timing-function: ease-in-out; }`,
        description: 'CSS过渡效果示例'
      },
      {
        id: '2',
        language: 'css',
        code: `/* CSS 动画 - @keyframes */

/* 定义动画 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes colorChange {
  0% { background-color: #e74c3c; }
  25% { background-color: #f39c12; }
  50% { background-color: #2ecc71; }
  75% { background-color: #3498db; }
  100% { background-color: #e74c3c; }
}

/* 应用动画 */
.slide-element {
  animation: slideIn 0.5s ease-out;
}

.bouncing-ball {
  width: 50px;
  height: 50px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1s ease-in-out infinite;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ecf0f1;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

.pulse-btn {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  animation: pulse 2s ease-in-out infinite;
}

.rainbow {
  width: 100px;
  height: 100px;
  animation: colorChange 4s linear infinite;
}`,
        description: 'CSS动画@keyframes示例'
      },
      {
        id: '3',
        language: 'css',
        code: `/* CSS动画高级控制 */

/* 动画简写属性详解 */
.animated-box {
  width: 100px;
  height: 100px;
  background: #9b59b6;
  
  /* 完整简写：name duration timing-function delay iteration-count direction fill-mode */
  animation: 
    slideInRight    /* 动画名称 */
    1s              /* 持续时间 */
    ease-out        /* 速度曲线 */
    0.5s            /* 延迟时间 */
    3               /* 播放次数（infinite为无限） */
    alternate       /* 播放方向（normal/reverse/alternate/alternate-reverse） */
    forwards;       /* 填充模式（none/forwards/backwards/both） */
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 多个动画组合 */
.complex-animation {
  animation: 
    fadeIn 0.5s ease forwards,
    slideUp 0.5s ease 0.3s forwards,
    pulse 1s ease 1s 3;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
}

/* 暂停动画 */
.paused:hover {
  animation-play-state: paused;
}

/* 性能优化：使用transform和opacity */
.optimized {
  /* 好的做法 - GPU加速 */
  transform: translateX(100px);
  opacity: 0.5;
  
  /* 避免 - 触发重排 */
  /* left: 100px; */
  /* width: 200px; */
  
  /* 提示浏览器优化 */
  will-change: transform, opacity;
}

/* 减少动画对性能的影响 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`,
        description: 'CSS动画高级控制和性能优化'
      }
    ],
    notes: 'CSS动画性能优于JavaScript动画（使用requestAnimationFrame除外）。优先使用transform和opacity进行动画，它们不会触发重排。尊重用户的prefers-reduced-motion设置。',
    compatibility: 'transition: IE10+；animation/@keyframes: IE10+；现代浏览器完整支持',
    relatedPoints: ['css-flexbox-1', 'css-grid-1', 'js-dom-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'css-transform-1',
    title: 'CSS 变换（Transform）',
    category: 'css',
    subCategory: 'css-animation',
    difficulty: 'intermediate',
    tags: ['CSS', 'Transform', '变换', '2D', '3D', '过渡'],
    content: `
CSS transform 属性允许对元素进行旋转、缩放、移动、倾斜等变换操作。变换不会影响文档流，性能优异。

2D变换函数：
- translate(x, y)：移动元素
- translateX(x)：水平移动
- translateY(y)：垂直移动
- scale(x, y)：缩放
- scaleX(x)：水平缩放
- scaleY(y)：垂直缩放
- rotate(angle)：旋转（正值顺时针）
- skew(x-angle, y-angle)：倾斜
- matrix(a, b, c, d, e, f)：矩阵变换（高级）

3D变换函数：
- translate3d(x, y, z)：3D移动
- scale3d(x, y, z)：3D缩放
- rotate3d(x, y, z, angle)：3D旋转
- rotateX(angle)：沿X轴旋转
- rotateY(angle)：沿Y轴旋转
- rotateZ(angle)：沿Z轴旋转
- perspective(n)：透视距离

变换原点：
- transform-origin：设置变换的基准点（默认center center）

变换样式：
- transform-style: preserve-3d：保持3D空间
- backface-visibility：背面可见性

【更新标注】来源：W3School CSS教程 | 更新日期：2026-03-31
新增CSS变换完整知识点，涵盖2D和3D变换
    `,
    codeExamples: [
      {
        id: '1',
        language: 'css',
        code: `/* CSS 2D变换 */

.transform-box {
  width: 100px;
  height: 100px;
  background: #3498db;
  margin: 50px;
  transition: transform 0.3s ease;
}

/* 移动 */
.translate:hover {
  transform: translate(50px, 30px);
  /* 或分开写：transform: translateX(50px) translateY(30px); */
}

/* 缩放 */
.scale:hover {
  transform: scale(1.5);
  /* 或 transform: scale(1.5, 1.2); */
}

/* 旋转 */
.rotate:hover {
  transform: rotate(45deg);
  /* 负值逆时针：transform: rotate(-45deg); */
}

/* 倾斜 */
.skew:hover {
  transform: skew(20deg, 10deg);
}

/* 组合变换（顺序从右到左应用） */
.combine:hover {
  transform: translateX(50px) rotate(45deg) scale(1.2);
}

/* 变换原点 */
.origin {
  transform-origin: top left; /* 从左上角变换 */
}
.origin:hover {
  transform: rotate(45deg);
}

/* 实用：居中定位 */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 自身宽高的一半 */
}`,
        description: 'CSS 2D变换示例'
      },
      {
        id: '2',
        language: 'css',
        code: `/* CSS 3D变换 */

.scene {
  perspective: 1000px; /* 透视距离，越小透视效果越强 */
  width: 200px;
  height: 200px;
  margin: 50px;
}

.card-3d {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: transform 0.6s;
  transform-style: preserve-3d; /* 保持3D效果 */
}

.card-3d:hover {
  transform: rotateY(180deg);
}

/* 3D立方体 */
.cube {
  width: 100px;
  height: 100px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate3d 5s linear infinite;
}

.cube-face {
  position: absolute;
  width: 100px;
  height: 100px;
  opacity: 0.8;
}

.front  { transform: translateZ(50px); background: #e74c3c; }
.back   { transform: rotateY(180deg) translateZ(50px); background: #3498db; }
.right  { transform: rotateY(90deg) translateZ(50px); background: #2ecc71; }
.left   { transform: rotateY(-90deg) translateZ(50px); background: #f39c12; }
.top    { transform: rotateX(90deg) translateZ(50px); background: #9b59b6; }
.bottom { transform: rotateX(-90deg) translateZ(50px); background: #1abc9c; }

@keyframes rotate3d {
  from { transform: rotateX(0) rotateY(0); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}

/* 翻转卡片效果 */
.flip-card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
}

.flip-card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 隐藏背面 */
}

.flip-card-back {
  transform: rotateY(180deg);
  background: #3498db;
  color: white;
}`,
        description: 'CSS 3D变换和翻转卡片效果'
      }
    ],
    notes: 'transform是性能最优的CSS属性之一，不会触发重排。3D变换需要设置perspective才能看到效果。组合变换时注意顺序，从右到左依次应用。',
    compatibility: '2D transform: IE9+（需前缀）, 现代浏览器完整支持；3D transform: IE10+, 现代浏览器完整支持',
    relatedPoints: ['css-animation-1', 'css-transition-1', 'css-grid-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'css-responsive-1',
    title: 'CSS 响应式设计',
    category: 'css',
    subCategory: 'css-responsive',
    difficulty: 'intermediate',
    tags: ['CSS', '响应式', '媒体查询', 'Mobile First', '断点'],
    content: `
响应式网页设计（Responsive Web Design）使网页能够自适应不同设备的屏幕尺寸，提供最佳的用户体验。

核心原则：
- 流式布局：使用相对单位（%, vw, vh）而非固定像素
- 弹性媒体：图片和视频自适应容器
- 媒体查询：根据设备特性应用不同样式

视口设置：
- meta viewport标签：name="viewport" content="width=device-width, initial-scale=1.0"

媒体查询语法：
- @media media-type and (media-feature) { ... }
- 常用媒体类型：screen, print, all
- 常用特性：min-width, max-width, min-height, orientation

设计策略：
- Mobile First：先设计移动端，再通过min-width扩展到桌面端
- Desktop First：先设计桌面端，再通过max-width适配移动端

常用断点：
- 小型手机：< 576px
- 手机：576px - 767px
- 平板：768px - 991px
- 桌面：992px - 1199px
- 大屏桌面：>= 1200px

响应式单位：
- rem：相对于根元素字体大小
- em：相对于父元素字体大小
- vw/vh：视口宽/高的百分比
- vmin/vmax：vw和vh中的较小/较大值

【更新标注】来源：W3School CSS响应式教程 | 更新日期：2026-03-31
新增响应式设计完整知识点，涵盖媒体查询和Mobile First策略
    `,
    codeExamples: [
      {
        id: '1',
        language: 'css',
        code: `/* 基础响应式设置 */

/* 1. 视口设置（在HTML的head中） */
/* <meta name="viewport" content="width=device-width, initial-scale=1.0"> */

/* 2. 流式布局基础 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 3. 弹性图片 */
img {
  max-width: 100%;
  height: auto;
}

/* 4. Mobile First 媒体查询 */
/* 基础样式（移动端） */
.card {
  width: 100%;
  padding: 15px;
}

/* 平板 */
@media (min-width: 768px) {
  .card {
    width: 50%;
    float: left;
  }
}

/* 桌面 */
@media (min-width: 992px) {
  .card {
    width: 33.333%;
  }
}

/* 大屏 */
@media (min-width: 1200px) {
  .card {
    width: 25%;
  }
}

/* 5. 其他媒体查询示例 */
/* 横屏模式 */
@media (orientation: landscape) {
  .sidebar {
    display: flex;
  }
}

/* 打印样式 */
@media print {
  .no-print {
    display: none;
  }
  
  body {
    font-size: 12pt;
    color: black;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
        description: '响应式设计基础示例'
      },
      {
        id: '2',
        language: 'css',
        code: `/* 响应式网格系统 */

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col {
  flex: 1;
  padding: 0 15px;
}

/* 响应式列类 */
.col-1 { flex: 0 0 8.333333%; }
.col-2 { flex: 0 0 16.666667%; }
.col-3 { flex: 0 0 25%; }
.col-4 { flex: 0 0 33.333333%; }
.col-6 { flex: 0 0 50%; }
.col-12 { flex: 0 0 100%; }

/* 响应式断点 */
/* sm: 576px+ */
@media (min-width: 576px) {
  .col-sm-1 { flex: 0 0 8.333333%; }
  .col-sm-2 { flex: 0 0 16.666667%; }
  .col-sm-3 { flex: 0 0 25%; }
  .col-sm-4 { flex: 0 0 33.333333%; }
  .col-sm-6 { flex: 0 0 50%; }
  .col-sm-12 { flex: 0 0 100%; }
}

/* md: 768px+ */
@media (min-width: 768px) {
  .col-md-1 { flex: 0 0 8.333333%; }
  .col-md-2 { flex: 0 0 16.666667%; }
  .col-md-3 { flex: 0 0 25%; }
  .col-md-4 { flex: 0 0 33.333333%; }
  .col-md-6 { flex: 0 0 50%; }
  .col-md-12 { flex: 0 0 100%; }
}

/* lg: 992px+ */
@media (min-width: 992px) {
  .col-lg-1 { flex: 0 0 8.333333%; }
  .col-lg-2 { flex: 0 0 16.666667%; }
  .col-lg-3 { flex: 0 0 25%; }
  .col-lg-4 { flex: 0 0 33.333333%; }
  .col-lg-6 { flex: 0 0 50%; }
  .col-lg-12 { flex: 0 0 100%; }
}

/* 使用示例HTML：
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">内容1</div>
  <div class="col-12 col-md-6 col-lg-4">内容2</div>
  <div class="col-12 col-md-6 col-lg-4">内容3</div>
</div>
*/`,
        description: '响应式网格系统'
      },
      {
        id: '3',
        language: 'css',
        code: `/* 响应式导航菜单 */

/* 基础样式（移动端） */
.navbar {
  background: #2c3e50;
  padding: 1rem;
}

.nav-toggle {
  display: block; /* 移动端显示汉堡按钮 */
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: none; /* 默认隐藏 */
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.nav-menu.active {
  display: flex; /* 点击后显示 */
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0;
  display: block;
}

/* 桌面端 */
@media (min-width: 768px) {
  .nav-toggle {
    display: none; /* 隐藏汉堡按钮 */
  }
  
  .nav-menu {
    display: flex !important; /* 始终显示 */
    flex-direction: row;
    margin: 0;
  }
  
  .nav-link {
    padding: 0 1rem;
  }
}

/* 响应式字体 */
html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

/* 使用clamp实现流体字体 */
.fluid-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  /* 最小1rem，首选2.5vw，最大2rem */
}

/* 容器查询示例 */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}`,
        description: '响应式导航和字体'
      }
    ],
    notes: 'Mobile First是推荐的响应式设计策略，代码更简洁，性能更好。使用相对单位（rem, em, %, vw/vh）而非固定像素。测试响应式设计时，务必在真实设备上验证。',
    compatibility: '媒体查询: IE9+（部分支持）, IE10+完整支持；现代浏览器全面支持',
    relatedPoints: ['css-flexbox-1', 'css-grid-1', 'css-container-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'html-doctype-1',
    title: 'HTML5 DOCTYPE声明',
    category: 'html',
    subCategory: 'html-tags',
    difficulty: 'beginner',
    tags: ['HTML5', 'DOCTYPE', '文档类型', '标准模式'],
    content: `
DOCTYPE声明是HTML文档的第一行，用于告诉浏览器使用哪种HTML版本解析页面。

HTML5 DOCTYPE：
- 最简洁的声明方式：<!DOCTYPE html>
- 所有现代浏览器都支持
- 即使是旧版IE（IE6/IE7）也会由此转入标准模式

旧版DOCTYPE（不推荐）：
- XHTML 1.0 Transitional等复杂声明已被淘汰
- 冗长且难以记忆

为什么要使用DOCTYPE：
1. 触发浏览器的标准模式（Standards Mode）
2. 确保页面在不同浏览器中渲染一致
3. 避免怪异模式（Quirks Mode）导致的布局问题
4. 是HTML验证的基础

不定义DOCTYPE的后果：
- 浏览器进入怪异模式
- 盒模型计算方式不一致
- 样式表现异常
- 跨浏览器兼容性问题
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文档标题</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
        description: 'HTML5标准文档结构'
      }
    ],
    notes: 'DOCTYPE声明必须位于HTML文档的第一行，前面不能有任何字符（包括空格和注释）。HTML5的DOCTYPE不区分大小写。',
    compatibility: '所有浏览器都支持',
    relatedPoints: ['html-semantic-1', 'html-tags-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'html-img-alt-1',
    title: '图片Alt文本规范',
    category: 'html',
    subCategory: 'html-tags',
    difficulty: 'beginner',
    tags: ['HTML', 'img', 'alt', '可访问性', 'SEO'],
    content: `
img标签的alt属性用于提供图片的替代文本，是网页可访问性和SEO的重要组成部分。

Alt文本的作用：
1. 屏幕阅读器读取给视障用户
2. 图片加载失败时显示替代文字
3. 搜索引擎理解图片内容
4. 满足可访问性标准（WCAG）

Alt文本编写规范：
- 描述图片显示的内容或要达到的效果
- 简洁明了，避免冗长
- 不要以"图片"、"图像"开头
- 装饰性图片使用空字符串：alt=""

不同场景的Alt写法：
- 内容图片：清晰描述图片内容
- 功能图片（如按钮）：描述功能而非外观
- 装饰图片：alt=""（屏幕阅读器会忽略）
- 复杂图表：简要描述，详细内容在正文说明

错误示例：
- alt="图片" - 无意义
- alt="logo" - 过于笼统
- alt="点击这里" - 未描述内容
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<!-- 好的示例：描述清晰 -->
<img src="dog.gif" alt="Fido和我在公园里玩耍" />

<!-- 好的示例：空alt用于装饰性图片 -->
<img src="bullet.gif" alt="" />

<!-- 不好的示例：显得多余 -->
<img src="bullet.gif" alt="着重号" />

<!-- 不好的示例：过于笼统 -->
<img src="company-logo.png" alt="logo" />

<!-- 好的示例：描述功能和内容 -->
<img src="search-icon.png" alt="搜索" />
<img src="company-logo.png" alt="某某科技有限公司" />`,
        description: 'Alt文本编写正误对比'
      }
    ],
    notes: '所有img标签都必须有alt属性，即使内容为空。这是HTML标准和可访问性要求。',
    compatibility: '所有浏览器都支持',
    relatedPoints: ['html-semantic-1', 'html-canvas-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'html-table-1',
    title: 'HTML表格使用规范',
    category: 'html',
    subCategory: 'html-tags',
    difficulty: 'beginner',
    tags: ['HTML', 'table', '表格', '数据展示'],
    content: `
table标签应该只用于展示表格数据，而不应用于页面布局。

表格的基本结构：
- table：表格容器
- thead：表头区域
- tbody：表体区域
- tfoot：表尾区域（可选）
- tr：表格行
- th：表头单元格
- td：数据单元格
- caption：表格标题

表格使用原则：
1. 仅用于展示结构化数据
2. 始终使用th元素定义表头
3. 保持语义清晰，便于屏幕阅读器理解
4. 样式控制交给CSS，不要依赖表格属性

表格样式最佳实践：
- 使用CSS控制边框、间距、背景色
- 设置cellpadding、cellspacing、border为0
- 通过CSS实现斑马纹、悬停效果
- 响应式表格：小屏幕横向滚动或卡片式布局

不应使用表格的场景：
- 页面整体布局（应使用Flexbox/Grid）
- 简单的列表展示（应使用ul/ol）
- 表单布局（应使用div + CSS）
    `,
    codeExamples: [
      {
        id: '1',
        language: 'html',
        code: `<!-- 规范的表格结构 -->
<table class="data-table">
  <caption>2026年销售数据统计</caption>
  <thead>
    <tr>
      <th scope="col">月份</th>
      <th scope="col">销售额</th>
      <th scope="col">增长率</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1月</td>
      <td>¥100,000</td>
      <td>+5%</td>
    </tr>
    <tr>
      <td>2月</td>
      <td>¥120,000</td>
      <td>+20%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>总计</th>
      <td>¥220,000</td>
      <td>+12%</td>
    </tr>
  </tfoot>
</table>`,
        description: '语义化的表格结构'
      },
      {
        id: '2',
        language: 'css',
        code: `/* 表格样式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.data-table caption {
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

/* 斑马纹效果 */
.data-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}`,
        description: '表格CSS样式'
      }
    ],
    notes: '现代网页开发中，表格仅用于数据展示。页面布局应使用CSS Flexbox或Grid。',
    compatibility: '所有浏览器都支持',
    relatedPoints: ['html-semantic-1', 'css-flexbox-1', 'css-grid-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  },
  {
    id: 'jquery-basic-1',
    title: 'jQuery基础与选择器',
    category: 'javascript',
    subCategory: 'js-dom',
    difficulty: 'beginner',
    tags: ['jQuery', 'DOM操作', '选择器', 'JavaScript库'],
    content: `
jQuery是一个快速、小巧的JavaScript库，简化了HTML文档遍历、事件处理、动画和Ajax交互。

核心特性：
- 简洁的语法：$(selector).action()
- 跨浏览器兼容（特别是旧版IE）
- 强大的选择器引擎（支持CSS1-3选择器）
- 链式调用支持
- 丰富的插件生态

基础语法：
- $(document).ready()：DOM加载完成后执行
- $(selector)：选择元素
- .action()：执行操作

常用选择器：
- 元素选择器：$('p'), $('div')
- ID选择器：$('#id')
- 类选择器：$('.class')
- 属性选择器：$('[name=value]')
- 层级选择器：$('parent > child'), $('ancestor descendant')
- 过滤选择器：:first, :last, :even, :odd, :eq(index)

DOM操作：
- 内容操作：text(), html(), val()
- 属性操作：attr(), prop(), css()
- 元素操作：append(), prepend(), remove(), empty()
- 类操作：addClass(), removeClass(), toggleClass()

事件处理：
- click(), dblclick(), hover()
- on()：统一的事件绑定方法
- off()：解绑事件
    `,
    codeExamples: [
      {
        id: '1',
        language: 'javascript',
        code: `// 基础选择器
$(document).ready(function() {
  // 元素选择器
  $('p').css('color', 'red');
  
  // ID选择器
  $('#header').addClass('active');
  
  // 类选择器
  $('.btn').click(function() {
    alert('按钮被点击');
  });
  
  // 属性选择器
  $('[type="text"]').val('默认值');
  
  // 层级选择器
  $('ul li:first').addClass('first-item');
  
  // 过滤选择器
  $('tr:even').addClass('even-row');
});`,
        description: 'jQuery选择器示例'
      },
      {
        id: '2',
        language: 'javascript',
        code: `// DOM操作
$(document).ready(function() {
  // 内容操作
  $('#title').text('新标题');
  $('#content').html('<strong>加粗内容</strong>');
  $('#input').val('输入值');
  
  // 属性操作
  $('#link').attr('href', 'https://example.com');
  $('#checkbox').prop('checked', true);
  $('#box').css('background-color', 'blue');
  
  // 元素操作
  $('#list').append('<li>新项</li>');
  $('#item').remove();
  
  // 类操作
  $('#menu').addClass('active');
  $('#menu').removeClass('hidden');
  $('#menu').toggleClass('expanded');
  
  // 事件绑定
  $('#btn').on('click', function() {
    console.log('点击事件');
  });
  
  // 链式调用
  $('#box')
    .addClass('highlight')
    .css('color', 'red')
    .fadeIn(500);
});`,
        description: 'jQuery DOM操作和事件'
      }
    ],
    notes: 'jQuery在现代前端开发中使用逐渐减少，但在维护旧项目、快速原型开发中仍有价值。新项目建议优先使用原生JavaScript或现代框架。',
    compatibility: 'IE6+ 及所有现代浏览器',
    relatedPoints: ['js-dom-1', 'js-event-1', 'js-basic-1'],
    createdAt: '2026-03-31',
    updatedAt: '2026-03-31'
  }
]

export const getKnowledgeById = (id: string): KnowledgePoint | undefined => {
  return knowledgePoints.find(item => item.id === id)
}

// 获取分类及其所有子分类的ID列表
const getCategoryAndChildrenIds = (categoryId: string): string[] => {
  const ids = [categoryId]

  const findChildren = (cats: Category[], targetId: string): string[] | null => {
    for (const cat of cats) {
      if (cat.id === targetId) {
        // 找到目标分类，返回其所有子分类ID
        const childrenIds: string[] = []
        const collectIds = (categories: Category[] | undefined) => {
          if (!categories) return
          for (const c of categories) {
            childrenIds.push(c.id)
            collectIds(c.children)
          }
        }
        collectIds(cat.children)
        return childrenIds
      }
      if (cat.children) {
        const found = findChildren(cat.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  const childrenIds = findChildren(categories, categoryId)
  if (childrenIds) {
    ids.push(...childrenIds)
  }

  return ids
}

export const getKnowledgeByCategory = (categoryId: string): KnowledgePoint[] => {
  const validCategoryIds = getCategoryAndChildrenIds(categoryId)

  return knowledgePoints.filter(item =>
    validCategoryIds.includes(item.category) ||
    validCategoryIds.includes(item.subCategory)
  )
}

export const searchKnowledge = (keyword: string): KnowledgePoint[] => {
  const lowerKeyword = keyword.toLowerCase()
  return knowledgePoints.filter(item =>
    item.title.toLowerCase().includes(lowerKeyword) ||
    item.content.toLowerCase().includes(lowerKeyword) ||
    item.tags.some((tag: string) => tag.toLowerCase().includes(lowerKeyword))
  )
}
