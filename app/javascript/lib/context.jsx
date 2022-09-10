import React from 'react'

const Context = React.createContext({})

const useContext = () => React.useContext(Context)

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
