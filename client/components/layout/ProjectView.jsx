import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

import useElementSize from '~/lib/useElementSize'
import multiplexRefs from '~/lib/multiplexRefs'
import { useContext, ContextProvider } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import { projectWasOpened } from '~/lib/projectHistory'
import { setLastView } from '~/lib/restoreProjectView'
import useApplicationKeyboardShortcuts from '~/lib/useApplicationKeyboardShortcuts'
import useSearchModal from '~/lib/useSearchModal'
import useAccountModal from '~/lib/useAccountModal'
import cssAdd from '~/lib/cssAdd'

import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import OffcanavasSidebar from '~/components/layout/OffcanavasSidebar'
import AwaitRedirect from '~/components/AwaitRedirect'
import OverviewView from '~/components/layout/OverviewView'
import EditProjectView from '~/components/layout/EditProjectView'
import RecentlyViewedView from '~/components/layout/RecentlyViewedView'
import TagDocumentsView from '~/components/layout/TagDocumentsView'
import AllTagsView from '~/components/layout/AllTagsView'
import EditorView from '~/components/layout/EditorView'

const ProjectView = ({ childView }) => {
  const { projectId } = useContext()

  useEffect(() => projectWasOpened(projectId), [projectId])

  const { pathname: viewPath } = useLocation()

  const projectsBarRef = useRef()
  const topBarRef = useRef()
  const sideBarRef = useRef()
  const mainRef = useRef()
  const formattingToolbarRef = useRef()

  const [projectsBarSizeRef, { width: projectsBarWidth }] = useElementSize()
  const [topBarSizeRef, { height: topBarHeight }] = useElementSize()
  const [sideBarSizeRef, { width: sideBarWidth }] = useElementSize()
  const [formattingToolbarSizeRef, { width: formattingToolbarWidth }, forceResizeFormattingToolbar] = useElementSize()

  const { isLg, isXl } = useBreakpoints()
  const sidebarAlwaysVisible = isLg
  const centreViewByDefault = isXl

  useEffect(() => {
    const html = document.documentElement
    const baseScrollPadding = '1.25rem'
    html.style.setProperty('scroll-padding-top', sidebarAlwaysVisible ? baseScrollPadding : `${topBarHeight}px`)
    html.style.setProperty('scroll-padding-bottom', baseScrollPadding)
  }, [topBarHeight, sidebarAlwaysVisible])

  const [offcanvasSidebarVisible, setOffcanvasSidebarVisible] = useState(false)
  const showOffcanvasSidebar = () => setOffcanvasSidebarVisible(true)
  const hideOffcanvasSidebar = () => setOffcanvasSidebarVisible(false)

  const [searchModal, showSearchModal, hideSearchModal, toggleSearchModal] = useSearchModal()
  const [accountModal, showAccountModal, hideAccountModal] = useAccountModal()

  useEffect(() => {
    hideSearchModal()
    hideAccountModal()
  }, [childView.key, projectId])

  const useFormattingToolbar = useCallback(formattingToolbar => {
    useLayoutEffect(() => {
      forceResizeFormattingToolbar()
    }, [])

    return createPortal(formattingToolbar, formattingToolbarRef.current)
  }, [])

  useEffect(() => {
    if (sidebarAlwaysVisible) {
      setOffcanvasSidebarVisible(false)
    }
  }, [sidebarAlwaysVisible])

  const {
    ChildView,
    centreView = centreViewByDefault,
    showFormattingToolbar = false,
    restoreAsLastView = true,
  } = {
    awaitRedirect: {
      ChildView: AwaitRedirect,
      restoreAsLastView: false,
    },
    overview: {
      ChildView: OverviewView,
      centreView: false,
    },
    editProject: {
      ChildView: EditProjectView,
    },
    recentlyViewed: {
      ChildView: RecentlyViewedView,
      centreView: false,
    },
    showTag: {
      ChildView: TagDocumentsView,
      centreView: false,
    },
    allTags: {
      ChildView: AllTagsView,
      centreView: false,
    },
    editor: {
      ChildView: EditorView,
      showFormattingToolbar: true,
    },
  }[childView.type]

  useEffect(() => {
    if (restoreAsLastView) {
      setLastView(projectId, viewPath)
    }
  }, [projectId, viewPath])

  useApplicationKeyboardShortcuts({
    sectionRefs: [
      topBarRef,
      projectsBarRef,
      sideBarRef,
      mainRef,
      formattingToolbarRef,
    ],
    toggleSearchModal,
  })

  return (
    <ContextProvider
      useFormattingToolbar={useFormattingToolbar}
      topBarHeight={topBarHeight}
      showSearchModal={showSearchModal}
      showAccountModal={showAccountModal}
    >
      <TopBar
        ref={multiplexRefs([topBarRef, topBarSizeRef])}
        style={{
          left: projectsBarWidth || 'env(safe-area-inset-left)',
          right: 'env(safe-area-inset-right)',
        }}
        tabIndex="0"
        aria-label="Top bar"
        showSidebarButton={!sidebarAlwaysVisible}
        onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
      />

      {sidebarAlwaysVisible && (
        <>
          <nav
            ref={multiplexRefs([projectsBarRef, projectsBarSizeRef])}
            className="fixed top-0 bottom-0 left-0 overflow-y-auto border-r bg-slate-50 dark:bg-black/25 dark:border-transparent"
            style={{
              paddingLeft: 'env(safe-area-inset-left)',
            }}
            tabIndex="0"
            aria-label="Projects bar"
            children={<ProjectsBar />}
          />

          <nav
            ref={multiplexRefs([sideBarRef, sideBarSizeRef])}
            className="fixed bottom-0 overflow-y-auto p-5 pt-1 pr-1"
            style={{
              top: topBarHeight,
              left: projectsBarWidth || 'env(safe-area-inset-left)',
            }}
            tabIndex="0"
            aria-label="Sidebar"
            children={<Sidebar />}
          />
        </>
      )}

      {showFormattingToolbar && (
        <aside
          key={projectId}
          ref={multiplexRefs([formattingToolbarRef, formattingToolbarSizeRef])}
          className="fixed bottom-0 p-5 pt-1 pl-1 overflow-y-auto flex"
          style={{
            top: topBarHeight,
            right: 'env(safe-area-inset-right)',
          }}
          tabIndex="0"
          aria-label="Formatting toolbar"
        />
      )}

      <main
        className="min-h-screen flex flex-col"
        style={{
          paddingTop: topBarHeight,
          paddingLeft: (projectsBarWidth + sideBarWidth) || 'env(safe-area-inset-left)',
          paddingRight: cssAdd('env(safe-area-inset-right)', centreView
            ? Math.max(formattingToolbarWidth, projectsBarWidth + sideBarWidth)
            : formattingToolbarWidth),
        }}
      >
        <div ref={mainRef} className="grow flex flex-col p-5 pt-1" tabIndex="0" aria-label="Main">
          <ChildView
            key={`${projectId}/${childView.key}`}
            topBarHeight={topBarHeight}
            {...childView.props}
          />
        </div>
      </main>

      <OffcanavasSidebar visible={offcanvasSidebarVisible} onClose={() => setOffcanvasSidebarVisible(false)} />

      {searchModal}
      {accountModal}
    </ContextProvider>
  )
}

export default ProjectView
