import { useEffect } from 'react'

const titleParts = []

const updateTitle = () => {
  const parts = [...titleParts].filter(x => x !== undefined).reverse()
  document.title = parts.join(' - ')
}

const useTitle = (title, { layer = 0 } = {}) => {
  useEffect(() => {
    titleParts[layer] = title
    updateTitle()

    return () => {
      titleParts[layer] = undefined
      updateTitle()
    }
  }, [title, layer])
}

export default useTitle
