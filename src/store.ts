import { createStore as createZutandStore, StateCreator, StoreApi } from 'zustand/vanilla';
import { shallow } from 'zustand/shallow';
import { get } from 'lodash-es';
import deepEqual from 'fast-deep-equal';

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
    return this.stores[key];
  }
  create<T = any, U extends T = any>(initialStore: StateCreator<T, [], [], U>, key: string) {
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
  subscribe(fn: Listener, { key, path, deep }: { key: string; path: string; deep?: boolean }) {
    const _store = this.stores[key] as StoreApi<any>;
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

export const store = new StoreManager();

export { shallow, deepEqual };
