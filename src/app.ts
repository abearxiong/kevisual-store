// 当前的功能，把所有的模块注入到windows对象当中
import { useConfigKey, useContextKey } from './web-env.ts';
import { QueryRouterServer } from '@kevisual/router/browser';

// bind to window, 必须要的获取全局的环境变量
window.useConfigKey = useConfigKey;
window.useContextKey = useContextKey;
window.QueryRouterServer = QueryRouterServer;

// bind to window, 获取路由对象
useContextKey('app', () => new QueryRouterServer());
