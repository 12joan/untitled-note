import { useReducer } from 'react'

const useCounter = (initialValue = 0) => {
  return useReducer(counter => counter + 1, initialValue)
}

export default useCounter
