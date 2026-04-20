import { reactive, computed, toRefs } from '@mini-fc/core';
import type { Ref, ComputedRef } from '@mini-fc/core';

import type {
  StoreId,
  StateTree,
  _GettersTree,
  _ActionsTree,
  Store,
  DefineStoreOptions,
  DefineStoreReturn
} from './types.js';

const stores = new Map<StoreId, unknown>();

function isGetterWithState<S extends StateTree>(value: unknown): value is (state: S) => unknown {
  return typeof value === 'function' && value.length === 1;
}

function createStore<S extends StateTree, G extends _GettersTree<S>, A extends _ActionsTree>(
  id: StoreId,
  stateFn: () => S,
  getters?: G,
  actions?: A
): Store<S, G, A> {
  const state = reactive(stateFn());
  const store = {} as Store<S, G, A>;

  Object.assign(store, toRefs(state));

  if (getters) {
    for (const key in getters) {
      const getter = getters[key];
      if (isGetterWithState<S>(getter)) {
        const computedValue = computed(() => getter(state));
        Object.defineProperty(store, key, {
          get: () => computedValue.value,
          enumerable: true,
          configurable: true
        });
      } else if (typeof getter === 'function') {
        const computedValue = computed(() => (getter as () => unknown).call(store));
        Object.defineProperty(store, key, {
          get: () => computedValue.value,
          enumerable: true,
          configurable: true
        });
      }
    }
  }

  if (actions) {
    for (const key in actions) {
      const action = actions[key];
      (store as Record<string, unknown>)[key] = (...args: unknown[]) => {
        return action.apply(store, args);
      };
    }
  }

  return store;
}

export function defineStore<
  Id extends StoreId,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(options: DefineStoreOptions<Id, S, G, A>): DefineStoreReturn<S, G, A> {
  const { id, state, getters, actions } = options;

  return function useStore(): Store<S, G, A> {
    if (!stores.has(id)) {
      const store = createStore(id, state, getters, actions);
      stores.set(id, store);
    }

    return stores.get(id) as Store<S, G, A>;
  };
}

export function getStoreById<StoreType>(id: StoreId): StoreType | undefined {
  return stores.get(id) as StoreType | undefined;
}

export function deleteStore(id: StoreId): boolean {
  return stores.delete(id);
}

export function clearStores(): void {
  stores.clear();
}

export { stores };
