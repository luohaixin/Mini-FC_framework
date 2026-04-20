// DEV 标志
const __DEV__ = process.env.NODE_ENV !== 'production';

// 任务队列
const queue: (() => void)[] = [];
let isFlushing = false;
let isFlushPending = false;

// Promise 微任务辅助
const resolvedPromise = Promise.resolve();

// 当前执行的 Promise
let currentFlushPromise: Promise<void> | null = null;

// 调度器接口
export interface Scheduler {
  nextTick<T>(fn?: () => T): Promise<T>;
  flush(): void;
  queueJob(job: () => void): void;
}

// 排队一个任务
export function queueJob(job: () => void): void {
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}

// 排队并去重
export function queuePostFlushCb(cb: () => void): void {
  if (!queue.includes(cb)) {
    queue.push(cb);
    queueFlush();
  }
}

// 触发刷新
function queueFlush(): void {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}

// 执行任务队列
function flushJobs(): void {
  isFlushPending = false;
  isFlushing = true;

  if (__DEV__) {
    console.log('[mini-fc scheduler]: Flushing jobs, count:', queue.length);
  }

  try {
    // 复制队列并清空原队列
    const jobs = queue.slice();
    queue.length = 0;

    // 执行所有任务
    for (const job of jobs) {
      try {
        job();
      } catch (err) {
        if (__DEV__) {
          console.error('[mini-fc scheduler]: Job execution failed:', err);
        }
      }
    }
  } finally {
    isFlushing = false;
    currentFlushPromise = null;

    // 如果队列中还有任务，继续刷新
    if (queue.length > 0) {
      queueFlush();
    }
  }
}

// nextTick - 在下一个微任务中执行
export function nextTick<T = void>(fn?: () => T): Promise<T> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(fn) : (p as Promise<T>);
}

// 强制刷新队列
export function flush(): void {
  // 持续刷新直到队列为空且没有待处理的刷新
  while (queue.length > 0 || isFlushPending) {
    flushJobs();
  }
}

// 调度器对象
export const scheduler: Scheduler = {
  nextTick,
  flush,
  queueJob
};
