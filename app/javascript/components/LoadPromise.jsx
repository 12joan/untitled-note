import React from 'react'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const LoadPromise = props => {
  const [state, setState] = useState({ type: 'loading' })

  useEffect(() => {
    if (state.type !== 'loading') {
      setState({ type: 'loading' })

      return loadPromise()
    }
  }, props.dependenciesRequiringClear)

  useEffect(() => {
    return loadPromise()
  }, props.dependencies)

  const loadPromise = () => {
    const promise = (typeof props.promise === 'function') ? props.promise() : props.promise

    let upToDate = true

    promise
      .then(returnValue => upToDate && setState({ type: 'success', returnValue }))
      .catch(error => upToDate && setState({ type: 'error', error }))

    return () => {
      upToDate = false
    }
  }

  switch (state.type) {
    case 'loading':
      return props.loading()

    case 'success':
      return props.success(state.returnValue)

    case 'error':
      return props.error(state.error)

    default:
      throw new Error(`Unknown state type: ${state.type}`)
  }
}

LoadPromise.defaultProps = {
  dependencies: [],
  dependenciesRequiringClear: [],
}

LoadPromise.propTypes = {
  promise: PropTypes.oneOfType([
    PropTypes.instanceOf(Promise),
    PropTypes.func
  ]).isRequired,

  dependencies: PropTypes.array,

  success: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
}

export default LoadPromise
