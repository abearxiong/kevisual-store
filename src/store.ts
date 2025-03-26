import { createStore as createZutandStore, StateCreator, StoreApi } from 'zustand/vanilla';
import { shallow } from 'zustand/shallow';
import { get } from 'lodash-es';
import deepEqual from 'fast-deep-equal';

export const create = createZutandStore;
export type { StateCreator, StoreApi };

type Listener = (state: any, prevState: any) => void;

export class StoreManager {
  stores: Record<string, any>;
  constructor() {
    this.stores = {};
  }
  createStore<T = any, U extends T = any>(initialStore: StateCreator<T, [], [], U>, key: string) {
    if (this.stores[key]) {
      return this.stores[key];
    }
    this.stores[key] = createZutandStore(initialStore);
    return this.stores[key] as StoreApi<T>;
  }
  create<T extends Record<string, any>, U extends T = T>(initialStore: StateCreator<T, [], [], U>, key: string) {
    return this.createStore(initialStore, key) as StoreApi<T>;
  }
  createIfNotExists<T extends Record<string, any>, U extends T = T>(
    initialStore: StateCreator<T, [], [], U>,
    key: string,
    opts?: {
      force?: boolean;
    },
  ): StoreApi<T> {
    if (this.stores[key] && !opts?.force) {
      return this.stores[key];
    }
    if (this.stores[key] && opts?.force) {
      this.removeStore(key);
    }
    return this.createStore(initialStore, key);
  }
  getStore(key: string) {
    return this.stores[key];
  }
  removeStore(key: string) {
    delete this.stores[key];
  }
  clearStores() {
    this.stores = {};
  }
  shallow(objA: any, objB: any) {
    return shallow(objA, objB);
  }
  /**
   * path 为可以是 '.a.b.c'的形式
   * @param fn
   * @param param1
   * @returns
   */
  subscribe(fn: Listener, { key, path, deep, store }: { key: string; path: string; deep?: boolean; store?: StoreApi<any> }) {
    const _store = store || (this.stores[key] as StoreApi<any>);
    if (!_store) {
      console.error('no store', key);
      return;
    }
    return _store.subscribe((newState, oldState) => {
      try {
        const newPath = get(newState, path);
        const oldPath = get(oldState, path);
        if (!newPath && !oldPath) {
          return;
        }
        if (deep) {
          if (!deepEqual(newPath, oldPath)) {
            fn?.(newState, oldState);
          }
          return;
        }
        if (!shallow(newPath, oldPath)) {
          fn?.(newState, oldState);
        }
      } catch (e) {
        console.error('subscribe error', e);
      }
    });
  }
}
// export const store = new StoreManager();

type FnListener<T = any> = (state: T, prevState: T) => void;
type SubOptions = {
  path?: string;
  deep?: boolean;
  store?: StoreApi<any>;
};
export const sub = <T = any>(fn: FnListener<T>, { path, deep, store }: SubOptions) => {
  if (!store) {
    console.error('no store');
    return;
  }
  return store.subscribe((newState: T, oldState: T) => {
    try {
      const newPath = get(newState, path as string);
      const oldPath = get(oldState, path as string);
      if (!newPath && !oldPath) {
        // 都不存在
        return;
      }
      if (deep) {
        if (!deepEqual(newPath, oldPath)) {
          fn?.(newState, oldState);
        }
        return;
      }
      if (!shallow(newPath, oldPath)) {
        fn?.(newState, oldState);
      }
    } catch (e) {
      console.error('subscribe error', e);
    }
  });
};

export { shallow, deepEqual };
