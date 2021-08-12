import React from 'react'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordsAPI from 'lib/resources/KeywordsAPI'

import NavLink from 'components/NavLink'
import LoadPromise from 'components/LoadPromise'
import ProjectDropdownMenu from 'components/layout/ProjectDropdownMenu'

const NavigationMenu = props => {
  const { project, documentId } = useContext()

  return (
    <div className="h-100 border-end p-3 navigation-menu overflow-auto">
      <SectionHeader
        button={
          <ProjectDropdownMenu />
        }>
        <h2 className="fs-5 m-0">{project.name}</h2>
      </SectionHeader>

      <SectionList>
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
      </SectionList>

      <PinnedDocumentsMenu />

      <KeywordsMenu />
    </div>
  )
}

const PinnedDocumentsMenu = props => {
  const { projectId, documentIndexKey, pinnedDocumentsKey } = useContext()

  return (
    <LoadPromise
      dependencies={[documentIndexKey, pinnedDocumentsKey]}
      dependenciesRequiringClear={[projectId]}
      promise={() => DocumentsAPI(projectId).index({
        searchParams: {
          'sort_by': 'pinned_at',
          'sort_direction': 'asc',
          'pinned': true,
        },
      })}

      loading={() => <></>}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load pinned documents</strong>
          </div>
        )
      }}

      success={pinnedDocuments => {
        if (pinnedDocuments.length === 0) {
          return null
        }

        return (
          <>
            <SectionHeader>
              <h6 className="small text-secondary m-0">
                Pinned documents
              </h6>
            </SectionHeader>

            <SectionList>
              {
                pinnedDocuments.map(doc => (
                  <NavigationMenuItem
                    key={doc.id}
                    params={{ keywordId: undefined, documentId: doc.id }}
                    isActive={() => false}>
                    {doc.title || 'Untitled document'}
                  </NavigationMenuItem>
                ))
              }
            </SectionList>
          </>
        )
      }} />
  )
}

const KeywordsMenu = props => {
  const { projectId, documentId, reloadKeywordsKey } = useContext()

  return (
    <LoadPromise
      dependencies={[reloadKeywordsKey]}
      dependenciesRequiringClear={[projectId]}
      promise={() => KeywordsAPI(projectId).index()}

      loading={() => <></>}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load keywords</strong>
          </div>
        )
      }}

      success={keywords => {
        if (keywords.length === 0) {
          return null
        }

        return (
          <>
            <SectionHeader>
              <h6 className="small text-secondary m-0">
                Keywords
              </h6>
            </SectionHeader>

            <SectionList>
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
            </SectionList>
          </>
        )
      }} />
  )
}

const SectionHeader = props => {
  return (
    <div className={`container-fluid mb-2 ${props.className || ''}`}>
      <div className="row gx-3 align-items-center">
        <div className="col">
          {props.children}
        </div>

        {
          props.button && (
            <div className="col-auto">
              {props.button}
            </div>
          )
        }
      </div>
    </div>
  )
}

const SectionList = props => {
  return (
    <ul className="nav nav-pills flex-column mb-3">
      {props.children}
    </ul>
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
