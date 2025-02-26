// 当前的功能，把所有的模块注入到windows对象当中
import * as WebEnv from './web-env.ts';
import { QueryRouterServer } from '@kevisual/router/browser';
import * as Load from '@kevisual/load/browser';
import { Page } from './page.ts';

// bind to window, 必须要的获取全局的环境变量
const { useConfigKey, useConfigKeySync, useContextKey, useContextKeySync } = WebEnv;
window.useConfigKey = useConfigKey;
window.useConfigKeySync = useConfigKeySync;
window.useContextKey = useContextKey;
window.useContextKeySync = useContextKeySync;
// @ts-ignore
window.webEnv = WebEnv;
// @ts-ignore
window.Load = Load;
window.Page = Page;
window.QueryRouterServer = QueryRouterServer;

// bind to window, 获取路由对象
useContextKey('app', () => new QueryRouterServer());
