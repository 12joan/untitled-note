import { useReducer } from 'react'

const useRemountKey = () => {
  return useReducer(count => count + 1, 0)
}

export default useRemountKey
