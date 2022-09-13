import React from 'react'

const Placeholder = ({ className = '', ...otherProps }) => {
  return (
    <div className={`bg-slate-200 dark:bg-slate-800 motion-safe:animate-pulse cursor-wait ${className}`} {...otherProps} />
  )
}

const InlinePlaceholder = ({ length = '12ch', ...otherProps }) => Placeholder({
  className: `inline-block rounded-full h-4`,
  style: { width: length },
  ...otherProps,
})

export default Placeholder

export {
  InlinePlaceholder,
}
