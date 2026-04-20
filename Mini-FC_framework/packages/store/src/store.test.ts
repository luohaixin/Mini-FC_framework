import { describe, it, expect, beforeEach } from 'vitest';
import { defineStore, getStoreById, deleteStore, clearStores, stores } from './store.js';
import type { Store } from './types.js';

describe('defineStore', () => {
  beforeEach(() => {
    clearStores();
  });

  it('should create a store with state', () => {
    const useUserStore = defineStore({
      id: 'user',
      state: () => ({ name: 'John', age: 25 })
    });

    const store = useUserStore();

    expect(store.name.value).toBe('John');
    expect(store.age.value).toBe(25);
  });

  it('should create a store with getters', () => {
    const useUserStore = defineStore({
      id: 'user',
      state: () => ({ name: 'John', age: 25 }),
      getters: {
        doubleAge: state => state.age * 2,
        greeting(): string {
          return `Hello, ${this.name.value}!`;
        }
      }
    });

    const store = useUserStore();

    expect(store.doubleAge).toBe(50);
    expect(store.greeting).toBe('Hello, John!');
  });

  it('should create a store with actions', () => {
    const useUserStore = defineStore({
      id: 'user',
      state: () => ({ name: 'John', age: 25 }),
      actions: {
        updateName(name: string) {
          this.name.value = name;
        },
        incrementAge() {
          this.age.value++;
        }
      }
    });

    const store = useUserStore();

    store.updateName('Jane');
    expect(store.name.value).toBe('Jane');

    store.incrementAge();
    expect(store.age.value).toBe(26);
  });

  it('should return the same store instance on multiple calls', () => {
    const useUserStore = defineStore({
      id: 'user',
      state: () => ({ name: 'John' })
    });

    const store1 = useUserStore();
    const store2 = useUserStore();

    expect(store1).toBe(store2);
  });

  it('should support getters accessing other getters', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 10 }),
      getters: {
        double: state => state.count * 2,
        quadruple(): number {
          return this.double * 2;
        }
      }
    });

    const store = useStore();

    expect(store.double).toBe(20);
    expect(store.quadruple).toBe(40);
  });

  it('should support actions calling other actions', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 0 }),
      actions: {
        increment() {
          this.count.value++;
        },
        incrementBy(amount: number) {
          for (let i = 0; i < amount; i++) {
            this.increment();
          }
        }
      }
    });

    const store = useStore();

    store.incrementBy(5);
    expect(store.count.value).toBe(5);
  });

  it('should make state reactive', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 0 })
    });

    const store = useStore();

    store.count.value = 10;
    expect(store.count.value).toBe(10);
  });

  it('should support complex state objects', () => {
    interface User {
      id: number;
      name: string;
    }

    const useStore = defineStore({
      id: 'test',
      state: () => ({
        users: [{ id: 1, name: 'John' }] as User[],
        currentUser: null as User | null
      }),
      actions: {
        addUser(user: User) {
          this.users.value.push(user);
        },
        setCurrentUser(user: User) {
          this.currentUser.value = user;
        }
      }
    });

    const store = useStore();

    expect(store.users.value).toHaveLength(1);

    store.addUser({ id: 2, name: 'Jane' });
    expect(store.users.value).toHaveLength(2);

    store.setCurrentUser({ id: 1, name: 'John' });
    expect(store.currentUser.value).toEqual({ id: 1, name: 'John' });
  });
});

describe('store management', () => {
  beforeEach(() => {
    clearStores();
  });

  it('should get store by id', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 0 })
    });

    const store = useStore();
    const retrievedStore = getStoreById<typeof store>('test');

    expect(retrievedStore).toBe(store);
  });

  it('should return undefined for non-existent store', () => {
    const store = getStoreById('non-existent');
    expect(store).toBeUndefined();
  });

  it('should delete store by id', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 0 })
    });

    useStore();
    expect(stores.has('test')).toBe(true);

    const deleted = deleteStore('test');
    expect(deleted).toBe(true);
    expect(stores.has('test')).toBe(false);
  });

  it('should return false when deleting non-existent store', () => {
    const deleted = deleteStore('non-existent');
    expect(deleted).toBe(false);
  });

  it('should clear all stores', () => {
    defineStore({ id: 'store1', state: () => ({}) })();
    defineStore({ id: 'store2', state: () => ({}) })();

    expect(stores.size).toBe(2);

    clearStores();

    expect(stores.size).toBe(0);
  });
});

describe('TypeScript type inference', () => {
  beforeEach(() => {
    clearStores();
  });

  it('should infer correct types for state', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({
        name: 'John',
        age: 25,
        isActive: true
      })
    });

    const store = useStore();

    expect(typeof store.name.value).toBe('string');
    expect(typeof store.age.value).toBe('number');
    expect(typeof store.isActive.value).toBe('boolean');
  });

  it('should infer correct types for getters', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 10 }),
      getters: {
        double: state => state.count * 2,
        stringValue(): string {
          return String(this.count.value);
        }
      }
    });

    const store = useStore();

    expect(typeof store.double).toBe('number');
    expect(typeof store.stringValue).toBe('string');
  });

  it('should infer correct types for actions', () => {
    const useStore = defineStore({
      id: 'test',
      state: () => ({ count: 0 }),
      actions: {
        increment(): void {
          this.count.value++;
        },
        add(n: number): number {
          this.count.value += n;
          return this.count.value;
        }
      }
    });

    const store = useStore();

    expect(typeof store.increment).toBe('function');
    expect(typeof store.add).toBe('function');
    expect(store.add(5)).toBe(5);
  });
});
