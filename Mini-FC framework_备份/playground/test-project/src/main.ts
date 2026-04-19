import { h, render } from '@my-framework/core';
import { createRouter, RouterView } from '@my-framework/router';
import { defineStore } from '@mini-fc/store';

// 示例：使用 Store
interface CounterState {
  count: number;
}

const useCounterStore = defineStore({
  id: 'counter',
  state: (): CounterState => ({ count: 0 }),
  getters: {
    doubleCount: (state: CounterState) => state.count * 2
  },
  actions: {
    increment(): void {
      (this as unknown as CounterState).count++;
    }
  }
});

// Home 组件
function Home() {
  const counter = useCounterStore();
  
  return () => h('div', { class: 'home' }, [
    h('h1', {}, 'Welcome to test-project!'),
    h('p', {}, `Count: ${counter.count.value}`),
    h('p', {}, `Double: ${counter.doubleCount}`),
    h('button', { 
      onClick: () => counter.increment()
    }, 'Increment')
  ]);
}

// About 组件
function About() {
  return () => h('div', { class: 'about' }, [
    h('h1', {}, 'About'),
    h('p', {}, 'This is a Mini-FC project.')
  ]);
}

// App 组件
function App() {
  return () => h('div', { class: 'app' }, [
    h('nav', {}, [
      h('a', { href: '#/' }, 'Home'),
      ' | ',
      h('a', { href: '#/about' }, 'About')
    ]),
    h(RouterView, {})
  ]);
}

// 创建路由
createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
});

// 挂载应用
const app = document.getElementById('app');
if (app) {
  render(h(App, {}), app);
}
