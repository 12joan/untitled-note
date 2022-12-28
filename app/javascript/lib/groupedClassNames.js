const mergeGroupedClassNames = (base, custom) => {
  if (!custom) {
    return base
  } else if (typeof custom === 'function') {
    return custom(base)
  } else {
    return { ...base, ...custom }
  }
}

const resolveGroupedClassNames = groupedClassNames => Object.values(groupedClassNames)
  .filter(Boolean)
  .join(' ')
  .replace(/\s+/g, ' ')
  .trim()

const groupedClassNames = (base, custom) => resolveGroupedClassNames(mergeGroupedClassNames(base, custom))

export default groupedClassNames
