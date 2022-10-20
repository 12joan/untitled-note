import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useElementSize } from 'usehooks-ts'

import { useContext, ContextProvider } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'
import { projectWasOpened } from '~/lib/projectHistory'
import { setLastView } from '~/lib/restoreProjectView'
import cssAdd from '~/lib/cssAdd'

import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import OffcanavasSidebar from '~/components/layout/OffcanavasSidebar'
import SearchModal from '~/components/layout/SearchModal'
import AwaitRedirect from '~/components/AwaitRedirect'
import OverviewView from '~/components/layout/OverviewView'
import EditProjectView from '~/components/layout/EditProjectView'
import RecentlyViewedView from '~/components/layout/RecentlyViewedView'
import TagDocumentsView from '~/components/layout/TagDocumentsView'
import AllTagsView from '~/components/layout/AllTagsView'
import EditorView from '~/components/layout/EditorView'

const ProjectView = ({ childView }) => {
  const [projectsBarRef, { width: projectsBarWidth }] = useElementSize()
  const [topBarRef, { height: topBarHeight }] = useElementSize()
  const [sideBarRef, { width: sideBarWidth }] = useElementSize()
  const [formattingToolbarSizeRef, { width: formattingToolbarWidth }] = useElementSize()

  const { isMd, isXl } = useBreakpoints()

  const [offcanvasSidebarVisible, setOffcanvasSidebarVisible] = useState(false)
  const [searchModalVisible, setSearchModalVisible] = useState(false)

  useGlobalKeyboardShortcut(
    ['MetaK', 'MetaJ', 'MetaG'],
    event => {
      event.preventDefault()
      setSearchModalVisible(visible => !visible)
    },
    []
  )

  const formattingToolbarRef = useRef()

  const useFormattingToolbar = useCallback(formattingToolbar => {
    const portal = createPortal(formattingToolbar, formattingToolbarRef.current)
    useLayoutEffect(() => formattingToolbarSizeRef(formattingToolbarRef.current), [])
    return portal
  }, [])

  useEffect(() => {
    if (isMd) {
      setOffcanvasSidebarVisible(false)
    }
  }, [isMd])

  const {
    ChildView,
    centreView = isXl,
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

  const { project } = useContext()
  useEffect(() => projectWasOpened(project.id), [project.id])

  const { pathname: viewPath } = useLocation()

  useEffect(() => {
    if (restoreAsLastView) {
      setLastView(project.id, viewPath)
    }
  }, [project.id, viewPath])

  return (
    <ContextProvider
      useFormattingToolbar={useFormattingToolbar}
      topBarHeight={topBarHeight}
      showSearchModal={() => setSearchModalVisible(true)}
    >
      <TopBar
        ref={topBarRef}
        style={{
          left: projectsBarWidth || 'env(safe-area-inset-left)',
          right: 'env(safe-area-inset-right)',
        }}
        showSidebarButton={!isMd}
        onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
      />

      {isMd && (
        <>
          <nav
            ref={projectsBarRef}
            className="fixed top-0 bottom-0 left-0 overflow-y-auto border-r bg-slate-50 dark:bg-black/25 dark:border-transparent"
            style={{
              paddingLeft: 'env(safe-area-inset-left)',
            }}
            children={<ProjectsBar />}
          />

          <nav
            ref={sideBarRef}
            className="fixed bottom-0 overflow-y-auto p-5 pt-1 pr-1"
            style={{
              top: topBarHeight,
              left: projectsBarWidth || 'env(safe-area-inset-left)',
            }}
            children={<Sidebar />}
          />
        </>
      )}

      {showFormattingToolbar && (
        <aside
          ref={formattingToolbarRef}
          className="fixed bottom-0 p-5 pt-1 pl-1 overflow-y-auto flex"
          style={{
            top: topBarHeight,
            right: 'env(safe-area-inset-right)',
          }}
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
        <div className="grow flex flex-col p-5 pt-1">
          <ChildView
            key={childView.key}
            topBarHeight={topBarHeight}
            {...childView.props}
          />
        </div>
      </main>

      <OffcanavasSidebar visible={offcanvasSidebarVisible} onClose={() => setOffcanvasSidebarVisible(false)} />
      <SearchModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
    </ContextProvider>
  )
}

export default ProjectView
