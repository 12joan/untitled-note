import React from 'react'
import { useEffect } from 'react'

const RunOnMount = props => {
  useEffect(props.onMount, [])
  return props.children || null
}

export default RunOnMount
