import React from 'react'

import { useContext } from 'lib/context'

import NavLink from 'components/NavLink'
import ProjectDropdownMenu from 'components/layout/ProjectDropdownMenu'

const NavigationMenu = props => {
  const { project, documentId } = useContext()

  return (
    <div className="h-100 border-end p-3 navigation-menu">
      <div className="container-fluid mt-2 mb-3">
        <div className="row gx-3 align-items-center">
          <div className="col">
            <h2 className="fs-5 m-0">{project.name}</h2>
          </div>

          <div className="col-auto">
            <ProjectDropdownMenu />
          </div>
        </div>
      </div>

      <ul className="nav nav-pills flex-column mb-3">
        <NavigationMenuItem
          params={{ keywordId: undefined, documentId: undefined }}
          activeParams={['keywordId']}
          isActive={() => documentId !== 'deleted'}>
          All documents
        </NavigationMenuItem>

        <NavigationMenuItem
          params={{ keywordId: undefined, documentId: 'deleted' }}
          activeParams={['documentId']}>
          Recently deleted
        </NavigationMenuItem>
      </ul>

      <KeywordsMenu />
    </div>
  )
}
const KeywordsMenu = props => {
  const { keywords, documentId } = useContext()

  if (keywords.length === 0) {
    return null
  }

  return (
    <>
      <div className="container-fluid mb-2">
        <div className="row gx-3 align-items-center">
          <div className="col">
            <h6 className="small text-secondary m-0">Keywords</h6>
          </div>
        </div>
      </div>

      <ul className="nav nav-pills flex-column mb-3">
        {
          keywords.map(keyword => (
            <NavigationMenuItem
              key={keyword.id}
              params={{ keywordId: keyword.id, documentId: undefined }}
              activeParams={['keywordId']}
              isActive={() => documentId !== 'deleted'}>
              {keyword.text}
            </NavigationMenuItem>
          ))
        }
      </ul>
    </>
  )
}

const NavigationMenuItem = props => (
  <li className="nav-item">
    <NavLink
      className="nav-link"
      activeClassName="active"
      params={props.params}
      activeParams={props.activeParams}
      isActive={props.isActive}>
      {props.children}
    </NavLink>
  </li>
)

export default NavigationMenu
