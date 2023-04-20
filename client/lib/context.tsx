import React, { createContext, useContext as reactUseContext, ReactNode } from 'react'

const Context = createContext({})

export const useContext = () => reactUseContext(Context)

export interface ContextProviderProps extends Record<string, any> {
  children: ReactNode
  context?: Record<string, any>
}

export const ContextProvider = ({
  context: contextProp = {},
  children,
  ...otherProps
}: ContextProviderProps) => {
  // const oldContext = useContext()
  // const newContext = { ...oldContext, ...(context || {}), ...otherProps }

  const context = {
    ...useContext(),
    ...contextProp,
    ...otherProps,
  };

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
};
