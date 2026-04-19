import { reactive, toRefs, computed } from "@my-framework/core";
const stores = /* @__PURE__ */ new Map();
function isGetterWithState(value) {
  return typeof value === "function" && value.length === 1;
}
function createStore(id, stateFn, getters, actions) {
  const state = reactive(stateFn());
  const store = {};
  Object.assign(store, toRefs(state));
  if (getters) {
    for (const key in getters) {
      const getter = getters[key];
      if (isGetterWithState(getter)) {
        const computedValue = computed(() => getter(state));
        Object.defineProperty(store, key, {
          get: () => computedValue.value,
          enumerable: true,
          configurable: true
        });
      } else if (typeof getter === "function") {
        const computedValue = computed(() => getter.call(store));
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
      store[key] = (...args) => {
        return action.apply(store, args);
      };
    }
  }
  return store;
}
function defineStore(options) {
  const { id, state, getters, actions } = options;
  return function useStore() {
    if (!stores.has(id)) {
      const store = createStore(id, state, getters, actions);
      stores.set(id, store);
    }
    return stores.get(id);
  };
}
function getStoreById(id) {
  return stores.get(id);
}
function deleteStore(id) {
  return stores.delete(id);
}
function clearStores() {
  stores.clear();
}
export {
  clearStores,
  defineStore,
  deleteStore,
  getStoreById,
  stores
};
//# sourceMappingURL=index.js.map
