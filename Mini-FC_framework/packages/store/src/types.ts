import type { Ref, ComputedRef, UnwrapRef } from '@mini-fc/core';

export type StoreId = string | symbol;

export type StateTree = Record<string, unknown>;

export type _GettersTree<S extends StateTree> = Record<
  string,
  ((state: S) => unknown) | (() => unknown)
>;

export type _ActionsTree = Record<string, (...args: unknown[]) => unknown>;

export type Store<S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree> = S & {
  readonly [K in keyof G]: G[K] extends (...args: unknown[]) => infer R
    ? R extends Ref<infer V>
      ? V
      : R extends ComputedRef<infer V>
        ? V
        : R
    : never;
} & {
  [K in keyof A]: A[K] extends (...args: infer P) => infer R ? (...args: P) => R : never;
};

export interface DefineStoreOptions<
  Id extends StoreId,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
> {
  id: Id;
  state: () => S;
  getters?: G & ThisType<S & G & A>;
  actions?: A & ThisType<S & G & A>;
}

export type DefineStoreReturn<
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
> = () => Store<S, G, A>;
