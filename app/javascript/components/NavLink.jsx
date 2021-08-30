import React from 'react'

import { buildUrl } from 'lib/routes'
import { useContext } from 'lib/context'

const NavLink = props => {
  const { projectId, keywordId, documentId, setParams } = useContext()

  const params = { projectId, keywordId, documentId }

  const isActive = Object.keys(props.params).every(key =>
    props.params[key] == params[key] // '==' for lax equality checking
  )

  return (
    <a
      href={buildUrl({ ...params, ...props.params })}
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
  className: '',
  activeClassName: '',
  inactiveClassName: '',
}

export default NavLink
