import { describe, it, expect } from 'vitest';
import { ref, reactive, computed } from './reactivity/index.js';

describe('reactive', () => {
  describe('ref', () => {
    it('should create a reactive reference', () => {
      const count = ref(0);
      expect(count.value).toBe(0);
    });

    it('should update value', () => {
      const count = ref(0);
      count.value = 5;
      expect(count.value).toBe(5);
    });
  });

  describe('reactive', () => {
    it('should create a reactive object', () => {
      const state = reactive({ count: 0 });
      expect(state.count).toBe(0);
    });

    it('should update reactive properties', () => {
      const state = reactive({ count: 0 });
      state.count = 5;
      expect(state.count).toBe(5);
    });
  });

  describe('computed', () => {
    it('should create a computed value', () => {
      const count = ref(2);
      const doubled = computed(() => count.value * 2);
      expect(doubled.value).toBe(4);
    });

    it('should update when dependencies change', () => {
      const count = ref(2);
      const doubled = computed(() => count.value * 2);
      count.value = 5;
      expect(doubled.value).toBe(10);
    });
  });
});
