import { getPathKey } from './utils/path-key.ts';

type GlobalEnv = {
  name?: string;
  [key: string]: any;
};
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

export const useEnvKey = <T = any>(key: string, init?: () => T | null, initKey = 'config'): T => {
  const _env = useEnv({}, initKey);
  if (key && _env[key]) {
    return _env[key];
  }
  if (key && init) {
    _env[key] = init();
    return _env[key];
  }

  return _env as any;
};

export const useEnvKeySync = async <T = any>(key: string, init?: () => Promise<T> | null, initKey = 'conifg'): Promise<T> => {
  const _env = useEnv({}, initKey);
  if (key && init) {
    _env[key] = await init();
    return _env[key];
  }
  if (key) {
    return _env[key];
  }
  return _env as any;
};

export const usePageEnv = (init?: () => {}, initKey = 'conifg') => {
  const { id } = getPathKey();
  return useEnvKey(id, init, initKey);
};

type GlobalContext = {
  name?: string;
  [key: string]: any;
};
export const useContext = (initContext?: GlobalContext) => {
  return useEnv(initContext, 'context');
};

export const useContextKey = <T = any>(key: string, init?: () => T): T => {
  return useEnvKey(key, init, 'context');
};

export const useContextKeySync = async <T = any>(key: string, init?: () => Promise<T>): Promise<T> => {
  return useEnvKeySync(key, init, 'context');
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

export const useConfigKey = <T = any>(key: string, init?: () => T): T => {
  return useEnvKey(key, init, 'config');
};

export const useConfigKeySync = async <T = any>(key: string, init?: () => Promise<T>): Promise<T> => {
  return useEnvKeySync(key, init, 'config');
};

export const usePageConfig = (init?: () => {}) => {
  const { id } = getPathKey();
  return useConfigKey(id, init);
};
