const cssAdd = (...unnormalizedValues) => {
  // Make sure all numeric values have units
  const values = unnormalizedValues.map(value => typeof value === 'number' ? `${value}px` : value)

  if (values.length === 0) {
    throw new Error('cssAdd requires at least one argument')
  }

  if (values.length === 1) {
    return values[0]
  }

  return `calc(${values.join(' + ')})`
}

export default cssAdd
