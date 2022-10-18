import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useElementSize } from 'usehooks-ts'

import { useContext, ContextProvider } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import { projectWasOpened } from '~/lib/projectHistory'
import { setLastView } from '~/lib/restoreProjectView'
import cssAdd from '~/lib/cssAdd'

import { ModalRoot, ModalPanel } from '~/components/Modal'
import LargeCloseIcon from '~/components/icons/LargeCloseIcon'
import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
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
    <ContextProvider useFormattingToolbar={useFormattingToolbar} topBarHeight={topBarHeight}>
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

      <ModalRoot open={offcanvasSidebarVisible} onClose={() => setOffcanvasSidebarVisible(false)}>
        <div className="fixed inset-0">
          <ModalPanel
            className="max-w-full absolute top-0 left-0 bottom-0 bg-slate-50/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-dialog transition-[transform,opacity] flex duration-300"
            style={{
              transform: offcanvasSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
              opacity: offcanvasSidebarVisible ? 1 : 0,
            }}
          >
            <div
              className="shrink-0 overflow-y-auto bg-slate-100/75 dark:bg-slate-900/25 border-r dark:border-transparent"
              style={{
                paddingLeft: 'env(safe-area-inset-left)',
              }}
            >
              <ProjectsBar onButtonClick={() => setOffcanvasSidebarVisible(false)} />
            </div>

            <div className="p-3 pl-5 overflow-y-auto flex items-start gap-2">
              <Sidebar onButtonClick={() => setOffcanvasSidebarVisible(false)} />

              <button
                type="button"
                className="btn rounded-full p-2 aspect-square sticky top-0"
                onClick={() => setOffcanvasSidebarVisible(false)}
              >
                <LargeCloseIcon size="1.25em" ariaLabel="Close" />
              </button>
            </div>
          </ModalPanel>
        </div>
      </ModalRoot>

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
    </ContextProvider>
  )
}

export default ProjectView
