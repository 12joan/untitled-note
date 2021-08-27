import React from 'react'

import { useContext } from 'lib/context'

const NavLink = props => {
  const { projectId, keywordId, documentId, setParams } = useContext()

  const params = { projectId, keywordId, documentId }

  const activeParams = props.activeParams || Object.keys(props.params)

  const isActive = activeParams.every(key =>
    props.params[key] == params[key] // '==' for lax equality checking
  ) && props.isActive()

  return (
    <a
      href="#"
      className={`${props.className} ${isActive ? props.activeClassName : props.inactiveClassName}`}
      onClick={event => {
        event.preventDefault()
        setParams(props.params)
        props.onClick?.(event)
      }}>
      {props.children}
    </a>
  )
}

NavLink.defaultProps = {
  isActive: () => true,
  className: '',
  activeClassName: '',
  inactiveClassName: '',
}

export default NavLink
