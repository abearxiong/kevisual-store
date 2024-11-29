import { getPathKey } from '@/utils/path-key.ts';
import { match } from 'path-to-regexp';

type PageOptions = {
  path?: string;
  key?: string;
  basename?: string;
};
type PageModule = {
  // 模块的key，如 user，定义模块的唯一标识
  key: string;
  // 模块的path路径，如 /user/:id，match的时候会用到
  path: string;
};
export class Page {
  pageModule = new Map<string, PageModule>();
  path: string;
  key: string;
  basename: string;
  constructor(opts?: PageOptions) {
    const pathKey = getPathKey();
    this.path = opts?.path ?? pathKey.path;
    this.key = opts?.key ?? pathKey.key;
    this.basename = opts?.basename ?? `/${this.path}/${this.key}`;
  }
  addPage(path: string, key?: string) {
    this.pageModule.set(key, { path, key });
  }
  check(key: string, pathname?: string): boolean | Record<string, string> {
    if (!key) {
      console.error('key is required');
      return;
    }
    const has = this.pageModule.has(key);
    if (!has) {
      console.error(`PageModule ${key} not found`);
      return;
    }
    const pageModule = this.pageModule.get(key);
    const location = window.location;
    const _pathname = pathname || location.pathname;
    const cur = _pathname.replace(this.basename, '');
    const routeMatch = match(pageModule.path, { decode: decodeURIComponent });
    const result = routeMatch(cur);
    let params = {};
    if (result) {
      result.path;
      params = result.params;
      return params;
    }
    return false;
  }
  /**
   *
   * @returns 返回当前路径
   */
  getPath() {
    const location = window.location;
    const pathname = location.pathname;
    return pathname.replace(this.basename, '');
  }
  decodePath(path: string) {
    return decodeURIComponent(path);
  }
  encodePath(path: string) {
    return encodeURIComponent(path);
  }
}
