import React from 'react'
import { useEffect } from 'react'

const SetBodyBackground = props => {
  useEffect(() => {
    const initialBackground = document.body.style.background

    document.body.style.background = props.background

    return () => {
      document.body.style.background = initialBackground
    }
  }, [props.background])

  return props.children || null
}

export default SetBodyBackground
