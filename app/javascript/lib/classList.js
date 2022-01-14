const classList = args => {
  if (Array.isArray(args)) {
    return args.map(classList).join(' ')
  } else if (typeof args === 'object') {
    return classList(Object.keys(args).filter(key => args[key]))
  } else {
    return String(args)
  }
}

export default classList
