import React, { forwardRef } from 'react'
import UnstyledTextareaAutosize from 'react-textarea-autosize'

const TextareaAutosize = forwardRef(({ className = '', ...otherProps }, ref) => {
  return (
    <UnstyledTextareaAutosize
      ref={ref}
      className={`overflow-wrap-break-word no-focus-ring resize-none bg-transparent ${className}`}
      {...otherProps}
    />
  )
})

export default TextareaAutosize
