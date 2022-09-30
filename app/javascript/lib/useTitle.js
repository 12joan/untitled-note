import { useEffect } from 'react'

import { APP_NAME } from '~/lib/config'

let stack = [{ id: undefined, title: APP_NAME }]

const updateTitle = () => {
  document.title = stack[stack.length - 1].title
}

const useTitle = title => useEffect(() => {
  if (title) {
    const id = Math.random()

    stack.push({ id, title })
    updateTitle()

    return () => {
      stack = stack.filter(item => item.id !== id)
      updateTitle()
    }
  }
}, [title])

export default useTitle
