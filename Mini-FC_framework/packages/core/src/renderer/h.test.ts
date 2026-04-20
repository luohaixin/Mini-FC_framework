import { describe, it, expect } from 'vitest';
import { h, isVNode, createTextVNode, Fragment, hFragment } from './h.js';

describe('h()', () => {
  it('should create a VNode with tag only', () => {
    const vnode = h('div');
    expect(vnode.type).toBe('div');
    expect(vnode.props).toEqual({});
    expect(vnode.children).toEqual([]);
    expect(vnode.el).toBeNull();
  });

  it('should create a VNode with props', () => {
    const vnode = h('div', { id: 'app', class: 'container' });
    expect(vnode.type).toBe('div');
    expect(vnode.props).toEqual({ id: 'app', class: 'container' });
    expect(vnode.children).toEqual([]);
  });

  it('should create a VNode with text children', () => {
    const vnode = h('div', null, 'Hello World');
    expect(vnode.type).toBe('div');
    expect(vnode.children).toEqual(['Hello World']);
  });

  it('should create a VNode with array children', () => {
    const vnode = h('ul', null, [h('li', null, 'Item 1'), h('li', null, 'Item 2')]);
    expect(vnode.type).toBe('ul');
    expect(vnode.children).toHaveLength(2);
    expect(isVNode(vnode.children[0])).toBe(true);
    expect(isVNode(vnode.children[1])).toBe(true);
  });

  it('should handle nested arrays of children', () => {
    const vnode = h('div', null, [
      [h('span', null, 'A'), h('span', null, 'B')],
      [h('span', null, 'C')]
    ]);
    expect(vnode.children).toHaveLength(3);
  });

  it('should extract key from props', () => {
    const vnode = h('div', { key: 'unique-key', id: 'app' });
    expect(vnode.key).toBe('unique-key');
    expect(vnode.props.key).toBeUndefined();
    expect(vnode.props.id).toBe('app');
  });

  it('should handle null and undefined children', () => {
    const vnode = h('div', null, ['text', null, undefined, h('span')]);
    expect(vnode.children).toHaveLength(2);
    expect(vnode.children[0]).toBe('text');
    expect(isVNode(vnode.children[1])).toBe(true);
  });

  it('should convert number children to string', () => {
    const vnode = h('div', null, 42);
    expect(vnode.children).toEqual(['42']);
  });

  it('should convert boolean children to string', () => {
    const vnodeTrue = h('div', null, true);
    const vnodeFalse = h('div', null, false);
    expect(vnodeTrue.children).toEqual(['true']);
    expect(vnodeFalse.children).toEqual(['false']);
  });

  it('should handle mixed children types', () => {
    const vnode = h('div', null, ['text', 123, h('span'), null]);
    expect(vnode.children).toHaveLength(3);
    expect(vnode.children[0]).toBe('text');
    expect(vnode.children[1]).toBe('123');
    expect(isVNode(vnode.children[2])).toBe(true);
  });
});

describe('isVNode()', () => {
  it('should return true for valid VNode', () => {
    const vnode = h('div');
    expect(isVNode(vnode)).toBe(true);
  });

  it('should return false for non-VNode values', () => {
    expect(isVNode(null)).toBe(false);
    expect(isVNode(undefined)).toBe(false);
    expect(isVNode('string')).toBe(false);
    expect(isVNode(123)).toBe(false);
    expect(isVNode({})).toBe(false);
    expect(isVNode({ type: 'div' })).toBe(false);
  });
});

describe('createTextVNode()', () => {
  it('should create a text VNode', () => {
    const vnode = createTextVNode('Hello');
    expect(vnode.type).toBeNull();
    expect(vnode.children).toEqual(['Hello']);
  });
});

describe('hFragment()', () => {
  it('should create a Fragment VNode', () => {
    const vnode = hFragment([h('div', null, 'A'), h('div', null, 'B')]);
    expect(vnode.type).toBe(Fragment);
    expect(vnode.children).toHaveLength(2);
  });
});
