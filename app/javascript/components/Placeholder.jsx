import React from 'react'

const Placeholder = ({ as: Component = 'div', className = '', ...otherProps }) => {
  return (
    <Component className={`bg-slate-200 dark:bg-slate-800 motion-safe:animate-pulse cursor-wait ${className}`} {...otherProps} />
  )
}

const InlinePlaceholder = ({ length = '12ch', className = '', ...otherProps }) => Placeholder({
  as: 'span',
  className: `inline-block rounded-full h-4 ${className}`,
  style: { width: length },
  ...otherProps,
})

export default Placeholder

export {
  InlinePlaceholder,
}
