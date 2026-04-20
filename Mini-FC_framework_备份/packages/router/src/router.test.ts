import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, getCurrentRouter } from './router.js';
import type { Route, RouterOptions } from './types.js';

// Mock window
declare global {
  interface Window {
    location: {
      hash: string;
      pathname: string;
      search: string;
      replace: (url: string) => void;
    };
    history: {
      pushState: (state: unknown, title: string, url: string) => void;
      replaceState: (state: unknown, title: string, url: string) => void;
      back: () => void;
      forward: () => void;
      go: (delta: number) => void;
    };
    addEventListener: (type: string, listener: EventListener) => void;
  }
}

const mockWindow = {
  location: {
    hash: '',
    pathname: '/',
    search: '',
    replace: vi.fn()
  },
  history: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn()
  },
  addEventListener: vi.fn()
};

// @ts-expect-error: mocking window
global.window = mockWindow;

describe('createRouter', () => {
  const mockComponent = { name: 'MockComponent', setup: () => () => null };

  const routes: Route[] = [
    { path: '/', component: mockComponent },
    { path: '/about', component: mockComponent },
    { path: '/user/:id', component: mockComponent },
    { path: '/posts/:id/edit', component: mockComponent }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockWindow.location.hash = '';
    mockWindow.location.pathname = '/';
    mockWindow.location.search = '';
  });

  it('should create a router instance', () => {
    const router = createRouter({ routes, mode: 'hash' });

    expect(router).toBeDefined();
    expect(router.currentRoute).toBeDefined();
    expect(typeof router.push).toBe('function');
    expect(typeof router.replace).toBe('function');
    expect(typeof router.back).toBe('function');
    expect(typeof router.forward).toBe('function');
    expect(typeof router.go).toBe('function');
    expect(typeof router.beforeEach).toBe('function');
    expect(typeof router.afterEach).toBe('function');
  });

  it('should get current router', () => {
    const router = createRouter({ routes, mode: 'hash' });
    const current = getCurrentRouter();
    expect(current).toBe(router);
  });

  describe('Hash mode', () => {
    it('should navigate using push', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.push('/about');

      // window.location.hash 不包含 # 前缀
      expect(mockWindow.location.hash).toBe('/about');
    });

    it('should navigate using replace', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.replace('/about');

      expect(mockWindow.location.replace).toHaveBeenCalledWith('#/about');
    });

    it('should handle back navigation', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.back();

      expect(mockWindow.history.back).toHaveBeenCalled();
    });

    it('should handle forward navigation', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.forward();

      expect(mockWindow.history.forward).toHaveBeenCalled();
    });

    it('should handle go navigation', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.go(-2);

      expect(mockWindow.history.go).toHaveBeenCalledWith(-2);
    });
  });

  describe('Route matching', () => {
    it('should match root route', () => {
      const router = createRouter({ routes, mode: 'hash' });

      mockWindow.location.hash = '#/';

      expect(router.currentRoute).not.toBeNull();
      expect(router.currentRoute?.route.path).toBe('/');
    });

    it('should match route with params', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.push('/user/123');

      expect(router.currentRoute).not.toBeNull();
      expect(router.currentRoute?.route.path).toBe('/user/:id');
      expect(router.currentRoute?.params).toEqual({ id: '123' });
    });

    it('should match route with query params', () => {
      const router = createRouter({ routes, mode: 'hash' });

      router.push('/about?foo=bar&baz=qux');

      expect(router.currentRoute).not.toBeNull();
      expect(router.currentRoute?.query).toEqual({ foo: 'bar', baz: 'qux' });
    });
  });

  describe('Navigation guards', () => {
    it('should execute beforeEach guards', async () => {
      const router = createRouter({ routes, mode: 'hash' });
      const guard = vi.fn().mockReturnValue(true);

      router.beforeEach(guard);
      router.push('/about');

      // Wait for async navigation
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(guard).toHaveBeenCalled();
    });

    it('should block navigation when guard returns false', async () => {
      const router = createRouter({ routes, mode: 'hash' });
      const guard = vi.fn().mockReturnValue(false);

      router.beforeEach(guard);
      router.push('/about');

      // Wait for async navigation
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(guard).toHaveBeenCalled();
      // Route should not change
      expect(router.currentRoute?.route.path).toBe('/');
    });

    it('should execute afterEach hooks', async () => {
      const router = createRouter({ routes, mode: 'hash' });
      const hook = vi.fn();

      router.afterEach(hook);
      router.push('/about');

      // Wait for async navigation
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(hook).toHaveBeenCalled();
    });

    it('should allow unregistering guards', () => {
      const router = createRouter({ routes, mode: 'hash' });
      const guard = vi.fn().mockReturnValue(true);

      const unregister = router.beforeEach(guard);
      unregister();

      router.push('/about');

      expect(guard).not.toHaveBeenCalled();
    });
  });

  describe('Base path', () => {
    it('should handle base path in hash mode', () => {
      const router = createRouter({ routes, mode: 'hash', base: '/app' });

      router.push('/about');

      // window.location.hash 不包含 # 前缀
      expect(mockWindow.location.hash).toBe('/app/about');
    });
  });
});
