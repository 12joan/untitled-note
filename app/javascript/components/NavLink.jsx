import React from 'react'

import { buildUrl } from 'lib/routes'
import { useContext } from 'lib/context'
import classList from 'lib/classList'

const NavLink = props => {
  const { projectId, keywordId, documentId, setParams } = useContext()

  const params = { projectId, keywordId, documentId }

  const { params: propsParams, className, activeClassName, inactiveClassName, onClick, children, ...otherProps } = props

  const isActive = Object.keys(propsParams).every(key =>
    propsParams[key] == params[key] // '==' for lax equality checking
  )

  return (
    <a
      href={buildUrl({ ...params, ...propsParams })}
      className={classList([className, isActive ? activeClassName : inactiveClassName])}
      onClick={event => {
        event.preventDefault()
        setParams(propsParams)
        props.onClick?.(event)
      }}
      {...otherProps}>
      {children}
    </a>
  )
}

NavLink.defaultProps = {
  className: '',
  activeClassName: '',
  inactiveClassName: '',
}

export default NavLink
