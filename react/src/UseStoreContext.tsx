import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StateCreator } from '../../src/store';
import { shallow, useShallow } from 'zustand/shallow';
import { useContextKey } from '../../src/web-context';

export const initStoreFn: StateCreator<any, [], [], any> = (set, get, store) => {
  return {
    description: 'this is a blank store',
  };
};
export const useStoreContext = (id: string, stateCreator?: StateCreator<any, [], [], any>) => {
  const StoreContext = createContext<any>(null);
  const store = useContextKey<any>('store');
  if (!store) {
    console.error('store not found');
    return null;
  }
  if (!stateCreator) {
    console.error('stateCreator not found');
    return null;
  }

  const StoreContextProvider = ({ children, id, stateCreator }: { children: React.ReactNode; id: string; stateCreator?: StateCreator<any, [], [], any> }) => {
    const smStore = useMemo(() => {
      console.log('stateCreator', stateCreator);
      return store.createIfNotExists(stateCreator || initStoreFn, id);
    }, [id]);
    const [state, setState] = useState(smStore);
    useEffect(() => {
      setState(smStore);
    }, [smStore]);
    console.log('value', smStore.getState());
    // console.log('value', state);
    return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
  };
  const useStore = (selector?: any) => {
    const store = useContext(StoreContext);
    const allState = store.getState();
    const selectedState = selector ? selector(allState) : allState;
    const [state, setState] = useState(selectedState);

    useEffect(() => {
      const unsubscribe = store.subscribe((newState: any) => {
        const newSelectedState = selector ? selector(newState) : newState;
        setState(newSelectedState);
      });
      return () => unsubscribe();
    }, [store, useShallow, state]);
  };
  useEffect(() => {
    // console.log('store', store);
    // @ts-ignore
    window.storeContext = {
      // @ts-ignore
      ...window.storeContext,
      [id]: {
        StoreContext,
        Provider: ({ children }: { children: React.ReactNode }) => {
          return (
            <StoreContextProvider id={id} stateCreator={stateCreator}>
              {children}
            </StoreContextProvider>
          );
        },
      },
    };
    return () => {
      // @ts-ignore
      delete window.storeContext[id];
    };
  }, [id]);
  return {
    StoreContext,
    Provider: ({ children }: { children: React.ReactNode }) => {
      return (
        <StoreContextProvider id={id} stateCreator={stateCreator}>
          {children}
        </StoreContextProvider>
      );
    },
    useStore,
  };
};
