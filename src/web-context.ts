import { getPathKey } from './utils/path-key.ts';

type GlobalContext = {
  name?: string;
  [key: string]: any;
};
export const useContext = (initContext?: GlobalContext) => {
  const context: GlobalContext = (window as any).context;
  const _context = context || initContext;
  !context && ((window as any)['context'] = _context);
  return _context;
};

export const useContextKey = <T>(key: string, init: () => T): T => {
  const _context = useContext({});
  if (key && init) {
    _context[key] = init();
    return _context[key] as any;
  }
  if (key) {
    return _context[key];
  }
  return _context as any;
};

export const useContextKeySync = async <T = any>(key: string, init: () => Promise<T>): Promise<T> => {
  const _context = useContext({});
  if (key && init) {
    _context[key] = await init();
    return _context[key] as any;
  }
  if (key) {
    return _context[key];
  }
  return _context as any;
};

export const usePageContext = (init?: () => {}) => {
  const { id } = getPathKey();
  return useContextKey(id, init);
};
