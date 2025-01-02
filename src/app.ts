// 当前的功能，把所有的模块注入到windows对象当中
import { useConfigKey, useConfigKeySync, useContextKeySync, useContextKey } from './web-env.ts';
import { QueryRouterServer } from '@kevisual/router/browser';
import { Page } from './page.ts';
// bind to window, 必须要的获取全局的环境变量
window.useConfigKey = useConfigKey;
window.useConfigKeySync = useConfigKeySync;
window.useContextKey = useContextKey;
window.useContextKeySync = useContextKeySync;
window.Page = Page;
window.QueryRouterServer = QueryRouterServer;

// bind to window, 获取路由对象
useContextKey('app', () => new QueryRouterServer());
