import React from 'react'
import { CaretLeftFill } from 'react-bootstrap-icons'

import { useContext, ContextProvider } from 'lib/context'
import DocumentsStream from 'lib/streams/DocumentsStream'

import NavLink from 'components/NavLink'
import LoadAsync from 'components/LoadAsync'
import ProjectDropdownMenu from 'components/layout/ProjectDropdownMenu'

const NavigationMenu = props => {
  const { project, documentId } = useContext()

  return (
    <ContextProvider dismissOffcanvas={props.dismissOffcanvas}>
      <div className="h-100 navigation-menu overflow-auto p-3">
        <div className="layout-row align-items-center mb-2 gap-2">
          <button
            type="button"
            id="all-projects-link"
            className="btn btn-link text-decoration-none focus-target"
            data-bs-target="#sidebar-carousel"
            data-bs-slide-to="0">
            <CaretLeftFill className="bi" /> All Projects
          </button>

          {
            props.isOffcanvas && (
              <div className="ms-auto">
                <button type="button" className="btn-close text-reset" onClick={props.dismissOffcanvas} aria-label="Close" />
              </div>
            )
          }
        </div>

        <div className="layout-row align-items-center mb-2 gap-2">
          <h2 className="fs-5 m-0">{project.name}</h2>
          <div className="ms-auto"><ProjectDropdownMenu /></div>
        </div>

        <Section>
          <NavigationMenuItem
            id="all-documents-link"
            params={{ keywordId: undefined, documentId: undefined }}>
            All Documents
          </NavigationMenuItem>
        </Section>

        <PinnedDocumentsMenu />
        <KeywordsMenu />
      </div>
    </ContextProvider>
  )
}

const PinnedDocumentsMenu = props => {
  const { projectId } = useContext()

  const indexParams = {
    query: { id: true, safe_title: true },
    pinned: true,
    sort_by: 'pinned_at',
    sort_direction: 'asc',
  }

  return (
    <LoadAsync
      dependenciesRequiringClear={[projectId]}

      provider={(resolve, reject) => {
        const subscription = DocumentsStream(projectId).index(indexParams, resolve)
        return () => subscription.unsubscribe()
      }}

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
            <SectionHeader>Pinned Documents</SectionHeader>

            {
              pinnedDocuments.map(doc => (
                <NavigationMenuItem
                  key={doc.id}
                  params={{ keywordId: undefined, documentId: doc.id }}>
                  {doc.safe_title}
                </NavigationMenuItem>
              ))
            }
          </Section>
        )
      }} />
  )
}

const KeywordsMenu = props => {
  const { keywords } = useContext()

  if (keywords.length === 0) {
    return null
  }

  return (
    <Section id="keywords-section">
      <SectionHeader>Keywords</SectionHeader>

      {
        keywords.map(keyword => (
          <NavigationMenuItem
            key={keyword.id}
            params={{ keywordId: keyword.id, documentId: undefined }}>
            {keyword.text}
          </NavigationMenuItem>
        ))
      }
    </Section>
  )
}

const Section = props => {
  return (
    <div id={props.id} className="mb-3">
      {props.children}
    </div>
  )
}

const SectionHeader = props => {
  return (
    <h6 className="small text-secondary mb-1">
      {props.children}
    </h6>
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
      className="navigation-menu-item d-block text-decoration-none mx-n3 px-3 py-1"
      activeClassName="active"
      params={props.params}
      onClick={dismissOffcanvas}>
      {props.children}
    </NavLink>
  )
}

export default NavigationMenu
