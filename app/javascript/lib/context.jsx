import React, { createContext, useContext as reactUseContext } from 'react'

const Context = createContext({})

const useContext = () => reactUseContext(Context)

const ContextProvider = props => {
  const { children, context, ...otherProps } = props

  const oldContext = useContext()
  const newContext = { ...oldContext, ...(context || {}), ...otherProps }

  return (
    <Context.Provider value={newContext}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, useContext }
