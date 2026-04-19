import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scheduler, nextTick, flush, queueJob, queuePostFlushCb } from './scheduler.js';

describe('scheduler', () => {
  beforeEach(() => {
    // 刷新队列以确保测试之间不会相互影响
    flush();
  });

  describe('queueJob()', () => {
    it('should queue and execute jobs asynchronously', async () => {
      const job = vi.fn();
      queueJob(job);
      expect(job).not.toHaveBeenCalled();
      
      await nextTick();
      expect(job).toHaveBeenCalledTimes(1);
    });

    it('should deduplicate jobs', async () => {
      const job = vi.fn();
      queueJob(job);
      queueJob(job);
      queueJob(job);
      
      await nextTick();
      expect(job).toHaveBeenCalledTimes(1);
    });

    it('should execute jobs in order', async () => {
      const order: number[] = [];
      queueJob(() => order.push(1));
      queueJob(() => order.push(2));
      queueJob(() => order.push(3));
      
      await nextTick();
      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe('queuePostFlushCb()', () => {
    it('should queue callbacks', async () => {
      const cb = vi.fn();
      queuePostFlushCb(cb);
      
      await nextTick();
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe('nextTick()', () => {
    it('should return a promise', () => {
      const p = nextTick();
      expect(p).toBeInstanceOf(Promise);
    });

    it('should execute callback after current flush', async () => {
      const order: string[] = [];
      
      queueJob(() => order.push('job'));
      await nextTick(() => order.push('tick'));
      
      expect(order).toEqual(['job', 'tick']);
    });

    it('should work without callback', async () => {
      let resolved = false;
      nextTick().then(() => {
        resolved = true;
      });
      
      await nextTick();
      expect(resolved).toBe(true);
    });
  });

  describe('flush()', () => {
    it('should execute queued jobs immediately', () => {
      const job = vi.fn();
      queueJob(job);
      expect(job).not.toHaveBeenCalled();
      
      flush();
      expect(job).toHaveBeenCalledTimes(1);
    });

    it('should handle nested flushes', () => {
      const order: number[] = [];
      
      queueJob(() => {
        order.push(1);
        queueJob(() => order.push(2));
      });
      
      flush();
      expect(order).toEqual([1, 2]);
    });
  });

  describe('scheduler object', () => {
    it('should expose nextTick', () => {
      expect(typeof scheduler.nextTick).toBe('function');
    });

    it('should expose flush', () => {
      expect(typeof scheduler.flush).toBe('function');
    });

    it('should expose queueJob', () => {
      expect(typeof scheduler.queueJob).toBe('function');
    });

    it('should work with scheduler.nextTick', async () => {
      const cb = vi.fn();
      await scheduler.nextTick(cb);
      expect(cb).toHaveBeenCalled();
    });

    it('should work with scheduler.flush', () => {
      const job = vi.fn();
      scheduler.queueJob(job);
      scheduler.flush();
      expect(job).toHaveBeenCalled();
    });
  });
});
