import { getPathKey } from './utils/path-key.ts';

type GlobalConfig = {
  name?: string;
  [key: string]: any;
};
export const useConfig = (initConfig?: GlobalConfig) => {
  const config: GlobalConfig = (window as any).config;
  const _config = config || initConfig;
  !config && ((window as any)['config'] = _config);
  return _config;
};

export const useConfigKey = <T>(key: string, init?: () => T): T => {
  const _config = useConfig({});
  if (key && init) {
    _config[key] = init();
    return _config[key] as any;
  }
  if (key) {
    return _config[key];
  }
  return _config as any;
};

export const useConfigKeySync = async <T = any>(key: string, init?: () => Promise<T>): Promise<T> => {
  const _config = useConfig({});
  if (key && init) {
    _config[key] = await init();
    return _config[key] as any;
  }
  if (key) {
    return _config[key];
  }
  return _config as any;
};

export const usePageConfig = (init?: () => {}) => {
  const { id } = getPathKey();
  return useConfigKey(id, init);
};
