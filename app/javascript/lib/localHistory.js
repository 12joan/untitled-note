import { getLocalStorage, setLocalStorage, useLocalStorage } from '~/lib/localStorage'

const makeLocalHistory = ({ key }) => {
  const touchItem = item => {
    const oldItems = getLocalStorage(key) ?? []

    const newItems = [
      item,
      ...oldItems.filter(oldItem => oldItem !== item),
    ]

    setLocalStorage(key, newItems)
  }

  const useItems = () => useLocalStorage(key, [])

  return [touchItem, useItems]
}

export default makeLocalHistory 
