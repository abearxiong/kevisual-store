// 当前的功能，把所有的模块注入到windows对象当中
import * as WebEnv from './web-env.ts';
import * as Load from '@kevisual/load/browser';
import { Page } from './page.ts';

export class PageInit {
  static isInit = false;
  static init(opts?: { load?: boolean; page?: boolean }) {
    if (PageInit.isInit) {
      return;
    }
    const { load = true, page = false } = opts || {};
    PageInit.isInit = true;
    // bind to window, 必须要的获取全局的环境变量
    const { useConfigKey, useContextKey } = WebEnv;
    window.useConfigKey = useConfigKey;
    window.useContextKey = useContextKey;
    // @ts-ignore
    window.webEnv = WebEnv;
    // @ts-ignore
    load && (window.Load = Load);
    page &&
      useContextKey('page', () => {
        return new Page();
      });
  }
}
PageInit.init();
