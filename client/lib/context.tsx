import React, {
  createContext,
  ReactNode,
  useContext as reactUseContext,
  useMemo,
} from 'react';

const Context = createContext({});

export const useContext = () => reactUseContext(Context);

export interface ContextProviderProps extends Record<string, any> {
  children: ReactNode;
  context?: Record<string, any>;
}

export const ContextProvider = ({
  context: contextProp = {},
  children,
  ...otherProps
}: ContextProviderProps) => {
  const oldContext = useContext();

  const context = useMemo(
    () => ({
      ...oldContext,
      ...contextProp,
      ...otherProps,
    }),
    [oldContext, contextProp, otherProps]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
