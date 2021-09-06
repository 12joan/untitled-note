import React from 'react'
import { CaretLeftFill } from 'react-bootstrap-icons'

import { useContext, ContextProvider } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordsAPI from 'lib/resources/KeywordsAPI'

import NavLink from 'components/NavLink'
import LoadPromise from 'components/LoadPromise'
import ProjectDropdownMenu from 'components/layout/ProjectDropdownMenu'

const NavigationMenu = props => {
  const { project, documentId } = useContext()

  return (
    <ContextProvider dismissOffcanvas={props.dismissOffcanvas}>
      <div className="h-100 p-3 navigation-menu overflow-auto">
        <div className="d-flex gap-2 align-items-center mb-2">
          <div>
            <button
              id="all-projects-link"
              className="focus-target btn btn-link text-decoration-none"
              data-bs-target="#sidebar-carousel"
              data-bs-slide-to="0">
              <CaretLeftFill className="bi" /> All Projects
            </button>
          </div>

          {
            props.isOffcanvas && (
              <div className="ms-auto">
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
              </div>
            )
          }
        </div>

        <Section>
          <SectionHeader
            button={
              <ProjectDropdownMenu />
            }>
            <h2 className="fs-5 m-0">{project.name}</h2>
          </SectionHeader>

          <SectionList>
            <NavigationMenuItem
              id="all-documents-link"
              params={{ keywordId: undefined, documentId: undefined }}>
              All Documents
            </NavigationMenuItem>
          </SectionList>
        </Section>

        <PinnedDocumentsMenu />

        <KeywordsMenu />
      </div>
    </ContextProvider>
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
          'select': 'id,title',
        },
      })}

      loading={() => <SectionListPlaceholder />}

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
          <Section id="pinned-documents-section">
            <SectionHeader>
              <h6 className="small text-secondary m-0">
                Pinned Documents
              </h6>
            </SectionHeader>

            <SectionList>
              {
                pinnedDocuments.map(doc => (
                  <NavigationMenuItem
                    key={doc.id}
                    params={{ keywordId: undefined, documentId: doc.id }}>
                    {doc.title || 'Untitled document'}
                  </NavigationMenuItem>
                ))
              }
            </SectionList>
          </Section>
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

      loading={() => <SectionListPlaceholder />}

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
          <Section id="keywords-section">
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
                    params={{ keywordId: keyword.id, documentId: undefined }}>
                    {keyword.text}
                  </NavigationMenuItem>
                ))
              }
            </SectionList>
          </Section>
        )
      }} />
  )
}

const Section = props => {
  return (
    <div id={props.id}>
      {props.children}
    </div>
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
    <div className="flex-column mb-3">
      {props.children}
    </div>
  )
}

const SectionListPlaceholder = props => {
  return (
    <div className="placeholder-glow">
      <span className="placeholder col-7"></span>{' '}
      <span className="placeholder col-4"></span>{' '}
      <span className="placeholder col-4"></span>{' '}
      <span className="placeholder col-6"></span>{' '}
      <span className="placeholder col-8"></span>
    </div>
  )
}

const NavigationMenuItem = props => {
  const { dismissOffcanvas } = useContext()

  return (
    <NavLink
      id={props.id}
      className="navigation-menu-item"
      activeClassName="active"
      params={props.params}
      onClick={dismissOffcanvas}>
      {props.children}
    </NavLink>
  )
}

export default NavigationMenu
