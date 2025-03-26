import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StateCreator } from '../../src/store';
import { shallow, useShallow } from 'zustand/shallow';
import { useContextKey } from '../../src/web-context';
import { UseBoundStore, StoreApi } from 'zustand';
export const StoreContext = createContext<any>(null);

export const initStoreFn: StateCreator<any, [], [], any> = (set, get, store) => {
  return {
    mark: '123',
    setMark: (mark: string) => set({ mark }),
    info: 'info',
    setInfo: (info) => set({ info }),
  };
};

export const StoreContextProvider = ({
  children,
  id,
  stateCreator,
}: {
  children: React.ReactNode;
  id: string;
  stateCreator?: StateCreator<any, [], [], any>;
}) => {
  const store = useContextKey<any>('store');
  if (!store) {
    console.error('store not found');
    return null;
  }
  const smStore = useMemo(() => {
    return store.createIfNotExists(stateCreator || initStoreFn, id);
  }, [id]);
  const [state, setState] = useState(smStore);
  useEffect(() => {
    setState(smStore);
  }, [smStore]);
  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

type SimpleObject = Record<string, any>;

export const useStore = (selector: any): any => {
  const store = useContext(StoreContext);
  const allState = store.getState();
  const selectedState = selector ? selector(allState) : allState;
  const [state, setState] = useState(selectedState);

  useEffect(() => {
    const unsubscribe = store.subscribe((newState: any) => {
      const newSelectedState = selector ? selector(newState) : newState;
      if (!shallow(state, newSelectedState)) {
        setState(newSelectedState);
      }
    });
    return () => unsubscribe();
  }, [store, useShallow, state]);

  return state;
};

export type BoundStore<T> = UseBoundStore<StoreApi<T>>;
