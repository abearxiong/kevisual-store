import { getPathKey } from './utils/path-key.ts';
import { BaseLoad } from '@kevisual/load';

type GlobalEnv = {
  name?: string;
  [key: string]: any;
};
// 从window对象中获取全局的环境变量，如果没有则初始化一个
export const useEnv = (initEnv?: GlobalEnv, initKey = 'config') => {
  const env: GlobalEnv = (window as any)[initKey];
  const _env = env || initEnv;
  if (!env) {
    if (_env) {
      (window as any)[initKey] = _env;
    } else {
      (window as any)[initKey] = {};
    }
  }
  return window[initKey] as GlobalEnv;
};

// 从全局环境变量中获取指定的key值，如果没有则初始化一个, key不存在，返回Env对象
export const useEnvKey = <T = any>(key: string, init?: () => T | null, initKey = 'config'): T => {
  const _env = useEnv({}, initKey);
  // 已经存在，直接返回
  if (key && typeof _env[key] !== 'undefined') {
    return _env[key];
  }
  // 不存在，但是有初始化函数，初始化的返回，同步函数，删除了重新加载？
  if (key && init) {
    _env[key] = init();
    return _env[key];
  }
  if (key) {
    // 加载
    const baseLoad = new BaseLoad();
    const voidFn = async () => {
      return _env[key];
    };
    const checkFn = async () => {
      const loadRes = await baseLoad.load(voidFn, {
        key,
        isReRun: true,
        checkSuccess: () => _env[key],
        timeout: 5 * 60 * 1000,
        interval: 1000,
        //
      });
      if (loadRes.code !== 200) {
        console.error('load key error');
        return null;
      }
      return _env[key];
    };
    return checkFn() as T;
  }
  // 不存在，没有初始化函数
  console.error('key is empty ');
  return null;
};

export const usePageEnv = (init?: () => {}, initKey = 'conifg') => {
  const { id } = getPathKey();
  return useEnvKey(id, init, initKey);
};
export const useEnvKeyNew = (key: string, initKey = 'conifg', opts?: { getNew?: boolean; init?: () => {} }) => {
  const _env = useEnv({}, initKey);
  if (key) {
    delete _env[key];
  }
  if (opts?.getNew && opts.init) {
    return useEnvKey(key, opts.init, initKey);
  } else if (opts?.getNew) {
    return useEnvKey(key, null, initKey);
  }
};
type GlobalContext = {
  name?: string;
  [key: string]: any;
};
export const useContext = (initContext?: GlobalContext) => {
  return useEnv(initContext, 'context');
};

export const useContextKey = <T = any>(key: string, init?: () => T, isNew?: boolean): T => {
  if (isNew) {
    return useEnvKeyNew(key, 'context', { getNew: true, init });
  }
  return useEnvKey(key, init, 'context');
};

export const usePageContext = (init?: () => {}) => {
  const { id } = getPathKey();
  return useContextKey(id, init);
};

type GlobalConfig = {
  name?: string;
  [key: string]: any;
};
export const useConfig = (initConfig?: GlobalConfig) => {
  return useEnv(initConfig, 'config');
};

export const useConfigKey = <T = any>(key: string, init?: () => T, isNew?: boolean): T => {
  if (isNew) {
    return useEnvKeyNew(key, 'config', { getNew: true, init });
  }
  return useEnvKey(key, init, 'config');
};

export const usePageConfig = (init?: () => {}) => {
  const { id } = getPathKey();
  return useConfigKey(id, init);
};
