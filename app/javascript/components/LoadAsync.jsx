import React from 'react'
import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import useEffectAfterFirst from 'lib/useEffectAfterFirst'

const LoadAsync = props => {
  const [state, setState] = useState({ type: 'loading' })
  const interruptCallback = useRef(undefined)

  useEffect(() => loadData(), [])

  useEffectAfterFirst(() => {
    loadData()
  }, props.dependencies)

  useEffectAfterFirst(() => {
    setState({ type: 'loading' })
    loadData()
  }, props.dependenciesRequiringClear)

  const loadData = () => {
    interrupt()

    interruptCallback.current = props.provider(
      data => setState({ type: 'success', data }),
      error => setState({ type: 'error', error }),
    )

    return interrupt
  }

  const interrupt = () => {
    interruptCallback.current?.call?.()
  }

  switch (state.type) {
    case 'loading':
      return props.loading()

    case 'success':
      return props.success(state.data)

    case 'error':
      return props.error(state.error)

    default:
      throw new Error(`Unknown state type: ${state.type}`)
  }
}

LoadAsync.defaultProps = {
  dependencies: [],
  dependenciesRequiringClear: [],
}

LoadAsync.propTypes = {
  provider: PropTypes.func.isRequired,

  dependencies: PropTypes.array,
  dependenciesRequiringClear: PropTypes.array,

  success: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
}

export default LoadAsync