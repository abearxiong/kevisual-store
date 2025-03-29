import { getPathKey } from '@/utils/path-key.ts';
import { match } from 'path-to-regexp';
import deepEqual from 'fast-deep-equal';

type PageOptions = {
  path?: string;
  key?: string;
  basename?: string;
  isListen?: boolean;
};
type PageModule = {
  // 模块的key，如 user，定义模块的唯一标识
  key: string;
  // 模块的path路径，如 /user/:id，match的时候会用到
  path: string;
};
type CallFn = (params: Record<string, any>, state?: any, e?: any) => any;
type CallbackInfo = {
  fn: CallFn;
  id: string;
} & PageModule;
export class Page {
  pageModule = new Map<string, PageModule>();
  // pathname的第一个路径
  path: string;
  // pathname的第二个路径
  key: string;
  basename: string;
  isListen: boolean;
  callbacks = [] as CallbackInfo[];
  constructor(opts?: PageOptions) {
    const pathKey = getPathKey();
    this.path = opts?.path ?? pathKey.path;
    this.key = opts?.key ?? pathKey.key;
    this.basename = opts?.basename ?? `/${this.path}/${this.key}`;
    const isListen = opts?.isListen ?? true;
    if (isListen) {
      this.listen();
    }
  }
  popstate(event?: PopStateEvent, manualOpts?: { id?: string; type: 'singal' | 'all' }) {
    const pathname = window.location.pathname;
    if (manualOpts) {
      if (manualOpts.type === 'singal') {
        const item = this.callbacks.find((item) => item.id === manualOpts.id);
        if (item) {
          const result = this.check(item.key, pathname);
          result && item.fn?.(result.params, event.state, { event });
        }
        return;
      }
    }
    // manual 为true时，表示手动调用，不需要检查是否相等
    this.callbacks.forEach((item) => {
      const result = this.check(item.key, pathname);
      result && item.fn?.(result.params, event.state, { event, manualOpts });
    });
  }
  listen() {
    this.isListen = true;
    window.addEventListener('popstate', this.popstate.bind(this), false);
  }
  unlisten() {
    this.isListen = false;
    window.removeEventListener('popstate', this.popstate.bind(this), false);
  }
  /**
   *
   * @param path 路径
   * @param key
   */
  addPage(path: string, key?: string) {
    this.pageModule.set(key, { path, key });
  }
  addObjectPages(pages: Record<string, string>) {
    Object.keys(pages).forEach((key) => {
      this.addPage(pages[key], key);
    });
  }
  addPages(pages: { path: string; key?: string }[]) {
    pages.forEach((item) => {
      this.addPage(item.path, item.key);
    });
  }
  /**
   * 检查当前路径是否匹配
   * @param key
   * @param pathname
   * @returns
   */
  check(key: string, pathname?: string): false | { pathname: string; params: Record<string, any> } {
    const has = this.pageModule.has(key);
    if (!has) {
      console.error(`PageModule ${key} not found`);
      return;
    }
    const pageModule = this.pageModule.get(key);
    if (!pageModule) {
      return false;
    }
    const location = window.location;
    const _pathname = pathname || location.pathname;
    const cur = _pathname.replace(this.basename, '');
    const routeMatch = match(pageModule.path, { decode: decodeURIComponent });
    const result = routeMatch(cur);
    let params = {};
    if (result) {
      result.path;
      params = result.params;
      return { pathname: _pathname, params };
    }
    return false;
  }
  /**
   * 订阅path监听事件
   * @param key
   * @param fn
   * @param opts
   * @returns
   */
  subscribe(key: string, fn?: CallFn, opts?: { pathname?: string; runImmediately?: boolean; id?: string }) {
    const runImmediately = opts?.runImmediately ?? true; // 默认立即执行
    const id = opts?.id ?? Math.random().toString(36).slice(2);
    const path = this.pageModule.get(key)?.path;
    if (!path) {
      console.error(`PageModule ${key} not found`);
      return () => {};
    }
    this.callbacks.push({ key, fn, id: id, path });
    if (runImmediately) {
      const location = window.location;
      const pathname = opts?.pathname ?? location.pathname;
      const result = this.check(key, pathname);
      if (result) {
        this.popstate({ state: window.history.state } as any, { id, type: 'singal' });
      }
    }
    return () => {
      this.callbacks = this.callbacks.filter((item) => item.id !== id);
    };
  }
  /**
   * 返回当前路径，不包含basename
   * @returns
   */
  getPath() {
    const location = window.location;
    const pathname = location.pathname;
    return pathname.replace(this.basename, '');
  }
  getAppPath() {
    return this.path;
  }
  getAppKey() {
    return this.key;
  }
  decodePath(path: string) {
    return decodeURIComponent(path);
  }
  encodePath(path: string) {
    return encodeURIComponent(path);
  }
  /**
   * 如果state 和 pathname都相等，则不执行popstate
   * @param path
   * @param state
   * @param check
   * @returns
   */
  navigate(path: string | number, state?: any, check?: boolean) {
    if (typeof path === 'number') {
      window.history.go(path);
      return;
    }
    const location = window.location;
    const pathname = location.pathname;

    const newPathname = new URL(this.basename + path, location.href).pathname;
    if (pathname === newPathname) {
      if (deepEqual(state, window.history.state)) {
        return;
      }
    }
    window.history.pushState(state, '', this.basename + path);
    let _check = check ?? true;
    if (_check) {
      this.popstate({ state } as any, { type: 'all' });
    }
  }
  replace(path: string, state?: any, check?: boolean) {
    let _check = check ?? true;
    window.history.replaceState(state, '', this.basename + path);
    if (_check) {
      this.popstate({ state } as any, { type: 'all' });
    }
  }
  refresh() {
    const state = window.history.state;
    this.popstate({ state } as any, { type: 'all' });
  }
}
/**
 * 获取history state
 * @returns
 */
export const getHistoryState = <T = Record<string, any>>() => {
  const history = window.history;
  const state = history.state || {};
  return state as T;
};

/**
 * 设置history state
 * @param state
 */
export const setHistoryState = (state: any) => {
  const history = window.history;
  const oldState = getHistoryState();
  // 只更新 state 而不改变 URL
  history.replaceState({ ...oldState, ...state }, '', window.location.href);
};

/**
 * 清除history state
 */
export const clearHistoryState = () => {
  const history = window.history;
  history.replaceState({}, '', window.location.href);
};
