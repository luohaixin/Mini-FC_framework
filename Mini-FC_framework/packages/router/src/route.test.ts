import { describe, it, expect } from 'vitest';
import { matchRoute } from './route.js';
import type { Route } from './types.js';

describe('matchRoute', () => {
  const routes: Route[] = [
    { path: '/', component: {} as unknown },
    { path: '/about', component: {} as unknown },
    { path: '/users/:id', component: {} as unknown },
    { path: '/posts/:category/:id', component: {} as unknown }
  ];

  it('should match root path', () => {
    const match = matchRoute('/', routes);
    expect(match).not.toBeNull();
    expect(match?.route.path).toBe('/');
  });

  it('should match static path', () => {
    const match = matchRoute('/about', routes);
    expect(match).not.toBeNull();
    expect(match?.route.path).toBe('/about');
  });

  it('should match dynamic path with params', () => {
    const match = matchRoute('/users/123', routes);
    expect(match).not.toBeNull();
    expect(match?.route.path).toBe('/users/:id');
    expect(match?.params).toEqual({ id: '123' });
  });

  it('should match multiple dynamic params', () => {
    const match = matchRoute('/posts/tech/456', routes);
    expect(match).not.toBeNull();
    expect(match?.route.path).toBe('/posts/:category/:id');
    expect(match?.params).toEqual({ category: 'tech', id: '456' });
  });

  it('should return null for unmatched path', () => {
    const match = matchRoute('/not-found', routes);
    expect(match).toBeNull();
  });

  it('should parse query parameters', () => {
    const match = matchRoute('/about?foo=bar&baz=qux', routes);
    expect(match).not.toBeNull();
    expect(match?.query).toEqual({ foo: 'bar', baz: 'qux' });
  });
});
