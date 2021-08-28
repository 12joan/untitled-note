import React from 'react'
import { CaretLeftFill } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordsAPI from 'lib/resources/KeywordsAPI'

import NavLink from 'components/NavLink'
import LoadPromise from 'components/LoadPromise'
import ProjectDropdownMenu from 'components/layout/ProjectDropdownMenu'

const NavigationMenu = props => {
  const { project, documentId } = useContext()

  return (
    <div className="h-100 p-3 navigation-menu overflow-auto">
      <div className="mb-2">
        <button
          className="btn btn-link text-decoration-none"
          data-bs-target="#sidebar-carousel"
          data-bs-slide-to="0">
          <CaretLeftFill className="bi" /> All Projects
        </button>
      </div>

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
          isActive={() => documentId !== 'deleted'}
          dismissOffcanvas={props.dismissOffcanvas}>
          All Documents
        </NavigationMenuItem>

        <NavigationMenuItem
          params={{ keywordId: undefined, documentId: 'deleted' }}
          activeParams={['documentId']}
          dismissOffcanvas={props.dismissOffcanvas}>
          Recently Deleted
        </NavigationMenuItem>
      </SectionList>

      <PinnedDocumentsMenu
        dismissOffcanvas={props.dismissOffcanvas} />

      <KeywordsMenu
        dismissOffcanvas={props.dismissOffcanvas} />
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
                    activeParams={['documentId']}
                    dismissOffcanvas={props.dismissOffcanvas}>
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
                    isActive={() => documentId !== 'deleted'}
                    dismissOffcanvas={props.dismissOffcanvas}>
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
      isActive={props.isActive}
      onClick={props.dismissOffcanvas}>
      {props.children}
    </NavLink>
  </li>
)

export default NavigationMenu
