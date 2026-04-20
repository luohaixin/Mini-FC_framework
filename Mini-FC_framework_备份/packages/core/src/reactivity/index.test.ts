import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ref,
  reactive,
  readonly,
  computed,
  watch,
  watchEffect,
  isRef,
  isReactive,
  isReadonly,
  toRaw,
  nextTick
} from './index.js';

describe('reactivity', () => {
  describe('ref', () => {
    it('should create a ref with initial value', () => {
      const count = ref(0);
      expect(count.value).toBe(0);
      expect(isRef(count)).toBe(true);
    });

    it('should update ref value', () => {
      const count = ref(0);
      count.value = 5;
      expect(count.value).toBe(5);
    });

    it('should hold object values', () => {
      const obj = ref({ count: 0 });
      expect(obj.value.count).toBe(0);
      obj.value.count = 5;
      expect(obj.value.count).toBe(5);
    });

    it('should unwrap nested refs', () => {
      const a = ref(1);
      const b = ref(a);
      expect(b.value).toBe(1);
    });

    it('should work without initial value', () => {
      const maybe = ref<number>();
      expect(maybe.value).toBeUndefined();
      maybe.value = 10;
      expect(maybe.value).toBe(10);
    });
  });

  describe('reactive', () => {
    it('should create reactive object', () => {
      const state = reactive({ count: 0 });
      expect(state.count).toBe(0);
      expect(isReactive(state)).toBe(true);
    });

    it('should track property changes', () => {
      const state = reactive({ count: 0 });
      state.count = 5;
      expect(state.count).toBe(5);
    });

    it('should track nested object changes', () => {
      const state = reactive({ nested: { count: 0 } });
      state.nested.count = 5;
      expect(state.nested.count).toBe(5);
    });

    it('should track array mutations', () => {
      const state = reactive({ items: [1, 2, 3] });
      state.items.push(4);
      expect(state.items).toHaveLength(4);
      expect(state.items[3]).toBe(4);
    });
  });

  describe('readonly', () => {
    it('should create readonly object', () => {
      const original = { count: 0 };
      const readonlyState = readonly(original);
      expect(isReadonly(readonlyState)).toBe(true);
    });

    it('should not allow direct mutation (warns in dev)', () => {
      const original = { count: 0 };
      const readonlyState = readonly(original);
      // Vue readonly warns but doesn't throw in production
      // We just verify the state wasn't changed
      readonlyState.count = 5;
      expect(readonlyState.count).toBe(0);
    });

    it('should reflect original changes', () => {
      const original = reactive({ count: 0 });
      const readonlyState = readonly(original);
      original.count = 5;
      expect(readonlyState.count).toBe(5);
    });
  });

  describe('computed', () => {
    it('should create computed ref', () => {
      const count = ref(2);
      const doubled = computed(() => count.value * 2);
      expect(doubled.value).toBe(4);
    });

    it('should cache computed value', () => {
      const getter = vi.fn(() => 42);
      const computedValue = computed(getter);
      
      // Access multiple times
      computedValue.value;
      computedValue.value;
      computedValue.value;
      
      // Getter should only be called once
      expect(getter).toHaveBeenCalledTimes(1);
    });

    it('should re-evaluate when dependency changes', () => {
      const count = ref(2);
      const doubled = computed(() => count.value * 2);
      
      expect(doubled.value).toBe(4);
      count.value = 5;
      expect(doubled.value).toBe(10);
    });

    it('should support writable computed', () => {
      const count = ref(1);
      const writableDoubled = computed({
        get: () => count.value * 2,
        set: (val: number) => {
          count.value = val / 2;
        }
      });
      
      expect(writableDoubled.value).toBe(2);
      writableDoubled.value = 10;
      expect(count.value).toBe(5);
      expect(writableDoubled.value).toBe(10);
    });

    it('should not recompute if dependency unchanged', () => {
      const count = ref(0);
      const getter = vi.fn(() => count.value * 2);
      const doubled = computed(getter);
      
      doubled.value;
      doubled.value;
      expect(getter).toHaveBeenCalledTimes(1);
      
      count.value = 1;
      doubled.value;
      expect(getter).toHaveBeenCalledTimes(2);
    });
  });

  describe('watch', () => {
    it('should watch ref changes', async () => {
      const count = ref(0);
      const callback = vi.fn();
      
      watch(count, callback);
      count.value = 5;
      
      await nextTick();
      expect(callback).toHaveBeenCalledWith(5, 0, expect.any(Function));
    });

    it('should support immediate option', async () => {
      const count = ref(0);
      const callback = vi.fn();
      
      watch(count, callback, { immediate: true });
      
      await nextTick();
      expect(callback).toHaveBeenCalledWith(0, undefined, expect.any(Function));
      expect(callback).toHaveBeenCalledTimes(1);
      
      count.value = 5;
      await nextTick();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should watch reactive object', async () => {
      const state = reactive({ count: 0 });
      const callback = vi.fn();
      
      watch(() => state.count, callback);
      state.count = 5;
      
      await nextTick();
      expect(callback).toHaveBeenCalledWith(5, 0, expect.any(Function));
    });

    it('should support deep watch', async () => {
      const state = reactive({ nested: { count: 0 } });
      const callback = vi.fn();
      
      watch(() => state.nested, callback, { deep: true });
      state.nested.count = 5;
      
      await nextTick();
      expect(callback).toHaveBeenCalled();
    });

    it('should stop watching when called', async () => {
      const count = ref(0);
      const callback = vi.fn();
      
      const stop = watch(count, callback);
      stop();
      
      count.value = 5;
      await nextTick();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('watchEffect', () => {
    it('should run effect immediately', async () => {
      const count = ref(0);
      const effectFn = vi.fn(() => {
        return count.value;
      });
      
      watchEffect(effectFn);
      await nextTick();
      expect(effectFn).toHaveBeenCalledTimes(1);
    });

    it('should re-run when dependency changes', async () => {
      const count = ref(0);
      const effectFn = vi.fn(() => {
        return count.value;
      });
      
      watchEffect(effectFn);
      await nextTick();
      
      count.value = 5;
      await nextTick();
      expect(effectFn).toHaveBeenCalledTimes(2);
    });

    it('should support cleanup', async () => {
      const count = ref(0);
      const cleanupFn = vi.fn();
      
      watchEffect((onCleanup) => {
        onCleanup(cleanupFn);
        return count.value;
      });
      
      await nextTick();
      count.value = 5;
      await nextTick();
      
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('utility functions', () => {
    it('toRaw should return original object', () => {
      const original = { count: 0 };
      const reactiveObj = reactive(original);
      expect(toRaw(reactiveObj)).toBe(original);
    });

    it('isRef should identify refs', () => {
      expect(isRef(ref(0))).toBe(true);
      expect(isRef(0)).toBe(false);
      expect(isRef(reactive({}))).toBe(false);
    });

    it('isReactive should identify reactive objects', () => {
      expect(isReactive(reactive({}))).toBe(true);
      expect(isReactive(ref(0))).toBe(false);
      expect(isReactive({})).toBe(false);
    });

    it('isReadonly should identify readonly objects', () => {
      expect(isReadonly(readonly({}))).toBe(true);
      expect(isReadonly(reactive({}))).toBe(false);
      expect(isReadonly(ref(0))).toBe(false);
    });
  });
});
