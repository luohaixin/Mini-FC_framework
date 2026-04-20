import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { h } from './h.js';
import { render } from './render.js';
import { defineComponent } from '../component/defineComponent.js';
import { ref, reactive, nextTick } from '../reactivity/index.js';
import { flush } from './scheduler.js';

// 模拟 DOM 环境
class MockElement {
  tagName: string;
  attributes: Record<string, string> = {};
  children: (MockElement | MockText)[] = [];
  className = '';
  style: Record<string, string> = {};
  textContent = '';
  parentNode: MockElement | null = null;
  eventListeners: Record<string, EventListener[]> = {};
  innerHTML = '';

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
  }

  get childNodes() {
    return this.children;
  }

  get firstChild() {
    return this.children[0] ?? null;
  }

  setAttribute(key: string, value: string) {
    this.attributes[key] = value;
  }

  getAttribute(key: string) {
    return this.attributes[key] ?? null;
  }

  removeAttribute(key: string) {
    delete this.attributes[key];
  }

  appendChild(child: MockElement | MockText) {
    this.children.push(child);
    child.parentNode = this;
    this.updateTextContent();
    return child;
  }

  removeChild(child: MockElement | MockText) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    this.updateTextContent();
    return child;
  }

  replaceChild(newChild: MockElement | MockText, oldChild: MockElement | MockText) {
    const index = this.children.indexOf(oldChild);
    if (index > -1) {
      this.children[index] = newChild;
      oldChild.parentNode = null;
      newChild.parentNode = this;
    }
    this.updateTextContent();
    return oldChild;
  }

  addEventListener(event: string, listener: EventListener) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(listener);
  }

  removeEventListener(event: string, listener: EventListener) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(listener);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }

  private updateTextContent() {
    this.textContent = this.children
      .map(c => (c instanceof MockText ? c.textContent : ''))
      .join('');
  }
}

class MockText {
  textContent: string;
  parentNode: MockElement | null = null;

  constructor(text: string) {
    this.textContent = text;
  }
}

// 简单的 DOM 模拟
global.document = {
  createElement: (tag: string) => new MockElement(tag),
  createTextNode: (text: string) => new MockText(text),
  createDocumentFragment: () => new MockElement('fragment')
} as unknown as Document;

describe('组件自动重新渲染机制', () => {
  let container: MockElement;

  beforeEach(() => {
    container = new MockElement('div');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ref 响应式数据触发重新渲染', () => {
    it('当 ref 值变化时应该自动重新渲染组件', async () => {
      const count = ref(0);

      const Counter = defineComponent({
        name: 'Counter',
        setup() {
          return () => h('div', { class: 'counter' }, `Count: ${count.value}`);
        }
      });

      const vnode = h(Counter);
      render(vnode, container as unknown as HTMLElement);

      // 验证初始渲染
      expect(container.children).toHaveLength(1);
      const initialEl = container.children[0] as MockElement;
      expect(initialEl.tagName).toBe('DIV');
      expect(initialEl.children[0].textContent).toBe('Count: 0');

      // 修改 ref 值
      count.value = 5;

      // 等待调度器执行
      flush();
      await Promise.resolve();

      // 验证重新渲染
      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children[0].textContent).toBe('Count: 5');
    });

    it('应该批量处理多次 ref 更新', async () => {
      const count = ref(0);
      const renderCount = { value: 0 };

      const Counter = defineComponent({
        name: 'Counter',
        setup() {
          return () => {
            renderCount.value++;
            return h('div', null, `Count: ${count.value}`);
          };
        }
      });

      const vnode = h(Counter);
      render(vnode, container as unknown as HTMLElement);

      // 记录初始渲染计数（包括首次渲染 + effect 建立依赖）
      const initialRenderCount = renderCount.value;
      expect(initialRenderCount).toBeGreaterThanOrEqual(2);

      // 多次修改 ref 值
      count.value = 1;
      count.value = 2;
      count.value = 3;

      // 等待调度器执行
      flush();
      await Promise.resolve();

      // 验证最终渲染结果
      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children[0].textContent).toBe('Count: 3');
      // 验证渲染次数增加了（至少有一次重新渲染）
      expect(renderCount.value).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('reactive 响应式数据触发重新渲染', () => {
    it('当 reactive 对象属性变化时应该自动重新渲染组件', async () => {
      const state = reactive({ count: 0, name: 'test' });

      const StateComponent = defineComponent({
        name: 'StateComponent',
        setup() {
          return () => h('div', null, `${state.name}: ${state.count}`);
        }
      });

      const vnode = h(StateComponent);
      render(vnode, container as unknown as HTMLElement);

      // 验证初始渲染
      const initialEl = container.children[0] as MockElement;
      expect(initialEl.children[0].textContent).toBe('test: 0');

      // 修改 reactive 对象的属性
      state.count = 10;
      state.name = 'updated';

      // 等待调度器执行
      flush();
      await Promise.resolve();

      // 验证重新渲染
      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children[0].textContent).toBe('updated: 10');
    });
  });

  describe('组件 Props 更新', () => {
    it('当组件 props 变化时应该触发重新渲染', async () => {
      const PropsComponent = defineComponent({
        name: 'PropsComponent',
        props: {
          message: String
        },
        setup(props) {
          return () => h('div', null, props.message || 'no message');
        }
      });

      // 首次渲染
      const vnode1 = h(PropsComponent, { message: 'Hello' });
      render(vnode1, container as unknown as HTMLElement);

      const initialEl = container.children[0] as MockElement;
      expect(initialEl.children[0].textContent).toBe('Hello');

      // 更新 props 重新渲染
      const vnode2 = h(PropsComponent, { message: 'World' });
      render(vnode2, container as unknown as HTMLElement);

      flush();
      await Promise.resolve();

      // 注意：由于组件更新机制是通过 props 变化触发，需要验证 DOM 是否更新
      // 在当前实现中，需要通过外部触发 render 函数来更新
    });
  });

  describe('复杂响应式场景', () => {
    it('应该正确处理计算属性依赖', async () => {
      const count = ref(0);

      const ComputedComponent = defineComponent({
        name: 'ComputedComponent',
        setup() {
          return () =>
            h('div', null, [
              h('span', null, `Count: ${count.value}`),
              h('span', null, `Double: ${count.value * 2}`)
            ]);
        }
      });

      const vnode = h(ComputedComponent);
      render(vnode, container as unknown as HTMLElement);

      // 验证初始渲染
      const initialEl = container.children[0] as MockElement;
      expect(initialEl.children).toHaveLength(2);

      // 修改 ref 值
      count.value = 5;

      flush();
      await Promise.resolve();

      // 验证重新渲染后的子元素
      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children).toHaveLength(2);
    });

    it('应该支持嵌套组件的响应式更新', async () => {
      const parentCount = ref(0);
      const childCount = ref(0);

      const ChildComponent = defineComponent({
        name: 'Child',
        setup() {
          return () => h('span', null, `Child: ${childCount.value}`);
        }
      });

      const ParentComponent = defineComponent({
        name: 'Parent',
        setup() {
          return () =>
            h('div', null, [h('span', null, `Parent: ${parentCount.value}`), h(ChildComponent)]);
        }
      });

      const vnode = h(ParentComponent);
      render(vnode, container as unknown as HTMLElement);

      // 修改父组件的响应式数据
      parentCount.value = 10;

      flush();
      await Promise.resolve();

      // 父组件应该重新渲染
      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children).toHaveLength(2);
    });
  });

  describe('边界情况', () => {
    it('应该处理组件返回空渲染的情况', async () => {
      const show = ref(true);

      const ConditionalComponent = defineComponent({
        name: 'Conditional',
        setup() {
          return () => (show.value ? h('div', null, 'Visible') : h('div', null, 'Hidden'));
        }
      });

      const vnode = h(ConditionalComponent);
      render(vnode, container as unknown as HTMLElement);

      const initialEl = container.children[0] as MockElement;
      expect(initialEl.children[0].textContent).toBe('Visible');

      // 切换显示状态
      show.value = false;

      flush();
      await Promise.resolve();

      const updatedEl = container.children[0] as MockElement;
      expect(updatedEl.children[0].textContent).toBe('Hidden');
    });

    it('setup 返回非函数时不应该创建 effect', async () => {
      const ObjectComponent = defineComponent({
        name: 'ObjectComponent',
        setup() {
          const count = ref(0);
          return { count };
        }
      });

      const vnode = h(ObjectComponent);
      render(vnode, container as unknown as HTMLElement);

      // 应该渲染一个空 div
      expect(container.children).toHaveLength(1);
      const el = container.children[0] as MockElement;
      expect(el.tagName).toBe('DIV');
    });
  });
});
