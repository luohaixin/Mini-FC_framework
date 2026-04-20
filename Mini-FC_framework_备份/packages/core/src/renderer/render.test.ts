import { describe, it, expect, vi, beforeEach } from 'vitest';
import { h, createTextVNode } from './h.js';
import { render, createElement, isSameVNodeType } from './render.js';

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
  createDocumentFragment: () => new MockElement('fragment'),
} as unknown as Document;

describe('createElement()', () => {
  it('should create element from VNode', () => {
    const vnode = h('div', { id: 'app' }, 'Hello');
    const el = createElement(vnode) as MockElement;

    expect(el.tagName).toBe('DIV');
    expect(el.getAttribute('id')).toBe('app');
    expect(el.children).toHaveLength(1);
    expect((el.children[0] as MockText).textContent).toBe('Hello');
  });

  it('should create nested elements', () => {
    const vnode = h('div', null, [
      h('span', null, 'A'),
      h('span', null, 'B'),
    ]);
    const el = createElement(vnode) as MockElement;

    expect(el.children).toHaveLength(2);
    expect((el.children[0] as MockElement).tagName).toBe('SPAN');
    expect((el.children[1] as MockElement).tagName).toBe('SPAN');
  });

  it('should create text node from null type VNode', () => {
    const vnode = createTextVNode('Hello');
    const el = createElement(vnode) as MockText;

    expect(el.textContent).toBe('Hello');
  });

  it('should handle class as array', () => {
    const vnode = h('div', { class: ['a', 'b', 'c'] });
    const el = createElement(vnode) as MockElement;

    expect(el.className).toBe('a b c');
  });

  it('should handle class as object', () => {
    const vnode = h('div', { class: { active: true, disabled: false } });
    const el = createElement(vnode) as MockElement;

    expect(el.className).toBe('active');
  });

  it('should handle style as object', () => {
    const vnode = h('div', { style: { color: 'red', fontSize: '14px' } });
    const el = createElement(vnode) as MockElement;

    expect(el.style.color).toBe('red');
    expect(el.style.fontSize).toBe('14px');
  });

  it('should handle event listeners', () => {
    const clickHandler = vi.fn();
    const vnode = h('button', { onClick: clickHandler }, 'Click me');
    const el = createElement(vnode) as MockElement;

    expect(el.eventListeners['click']).toHaveLength(1);
    expect(el.eventListeners['click'][0]).toBe(clickHandler);
  });

  it('should handle boolean attributes', () => {
    const vnode = h('input', { disabled: true, readonly: false });
    const el = createElement(vnode) as MockElement;

    expect(el.getAttribute('disabled')).toBe('');
    expect(el.getAttribute('readonly')).toBeNull();
  });
});

describe('isSameVNodeType()', () => {
  it('should return true for same type and key', () => {
    const n1 = h('div', { key: 'a' });
    const n2 = h('div', { key: 'a' });
    expect(isSameVNodeType(n1, n2)).toBe(true);
  });

  it('should return false for different type', () => {
    const n1 = h('div');
    const n2 = h('span');
    expect(isSameVNodeType(n1, n2)).toBe(false);
  });

  it('should return false for different key', () => {
    const n1 = h('div', { key: 'a' });
    const n2 = h('div', { key: 'b' });
    expect(isSameVNodeType(n1, n2)).toBe(false);
  });
});

describe('render()', () => {
  let container: MockElement;

  beforeEach(() => {
    container = new MockElement('div');
  });

  it('should mount VNode to container', () => {
    const vnode = h('div', { id: 'app' }, 'Hello');
    render(vnode, container as unknown as HTMLElement);

    expect(container.children).toHaveLength(1);
    expect((container.children[0] as MockElement).tagName).toBe('DIV');
  });

  it('should update existing VNode text content', () => {
    const vnode1 = h('div', null, 'First');
    const vnode2 = h('div', null, 'Second');

    render(vnode1, container as unknown as HTMLElement);
    render(vnode2, container as unknown as HTMLElement);

    expect(container.children).toHaveLength(1);
    // 检查子元素的 textContent
    const el = container.children[0] as MockElement;
    expect(el.children).toHaveLength(1);
    expect((el.children[0] as MockText).textContent).toBe('Second');
  });

  it('should update existing VNode attributes', () => {
    const vnode1 = h('div', { id: 'old' });
    const vnode2 = h('div', { id: 'new' });

    render(vnode1, container as unknown as HTMLElement);
    render(vnode2, container as unknown as HTMLElement);

    const el = container.children[0] as MockElement;
    expect(el.getAttribute('id')).toBe('new');
  });

  it('should replace element when type changes', () => {
    const vnode1 = h('div', null, 'Content');
    const vnode2 = h('span', null, 'Content');

    render(vnode1, container as unknown as HTMLElement);
    render(vnode2, container as unknown as HTMLElement);

    expect((container.children[0] as MockElement).tagName).toBe('SPAN');
  });

  it('should add new children', () => {
    const vnode1 = h('ul', null, [h('li', null, 'A')]);
    const vnode2 = h('ul', null, [h('li', null, 'A'), h('li', null, 'B')]);

    render(vnode1, container as unknown as HTMLElement);
    render(vnode2, container as unknown as HTMLElement);

    const ul = container.children[0] as MockElement;
    expect(ul.children).toHaveLength(2);
  });

  it('should remove extra children', () => {
    const vnode1 = h('ul', null, [h('li', null, 'A'), h('li', null, 'B')]);
    const vnode2 = h('ul', null, [h('li', null, 'A')]);

    render(vnode1, container as unknown as HTMLElement);
    render(vnode2, container as unknown as HTMLElement);

    const ul = container.children[0] as MockElement;
    expect(ul.children).toHaveLength(1);
  });

  it('should unmount when vnode is null', () => {
    const vnode = h('div', null, 'Content');
    render(vnode, container as unknown as HTMLElement);
    expect(container.children).toHaveLength(1);

    render(null, container as unknown as HTMLElement);
    expect(container.children).toHaveLength(0);
  });

  it('should clear container before mounting', () => {
    container.innerHTML = '<p>Existing</p>';
    const vnode = h('div', null, 'New');

    render(vnode, container as unknown as HTMLElement);

    expect(container.children).toHaveLength(1);
    expect((container.children[0] as MockElement).tagName).toBe('DIV');
  });
});
