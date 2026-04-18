import type { Component } from '@my-framework/core';

export interface Route {
  path: string;
  name?: string;
  component: Component | (() => Promise<Component>);
  children?: Route[];
  meta?: Record<string, unknown>;
}

export interface RouteMatch {
  route: Route;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface RouterOptions {
  routes: Route[];
  base?: string;
  mode?: 'hash' | 'history';
}

export interface Router {
  currentRoute: RouteMatch | null;
  push(path: string): void;
  replace(path: string): void;
  back(): void;
  forward(): void;
  go(delta: number): void;
  beforeEach(guard: NavigationGuard): () => void;
  afterEach(hook: NavigationHook): () => void;
}

export type NavigationGuard = (to: RouteMatch, from: RouteMatch | null) => boolean | Promise<boolean>;

export type NavigationHook = (to: RouteMatch, from: RouteMatch | null) => void;

// 路由链接 props
export interface RouterLinkProps {
  to: string | { path?: string; name?: string; params?: Record<string, string>; query?: Record<string, string> };
  replace?: boolean;
  activeClass?: string;
  exactActiveClass?: string;
}
