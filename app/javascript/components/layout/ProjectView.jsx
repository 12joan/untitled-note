import React, { useState, useRef, useEffect } from 'react'
import { useElementSize } from 'usehooks-ts'
import { useLocation } from 'react-router-dom'

import { useContext, ContextProvider } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import { projectWasOpened } from '~/lib/projectHistory'
import { setLastView } from '~/lib/restoreProjectView'
import multiplexRefs from '~/lib/multiplexRefs'

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
  const [formattingBarSizeRef, { width: formattingBarWidth }] = useElementSize()

  const { isMd, isXl } = useBreakpoints()

  const [offcanvasSidebarVisible, setOffcanvasSidebarVisible] = useState(false)

  const formattingBarRef = useRef()

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
    <ContextProvider formattingToolbarRef={formattingBarRef} topBarHeight={topBarHeight}>
      <TopBar
        ref={topBarRef}
        style={{ left: projectsBarWidth }}
        showSidebarButton={!isMd}
        onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
      />

      {isMd && (
        <>
          <nav
            ref={projectsBarRef}
            className="fixed top-0 bottom-0 left-0 overflow-y-auto border-r bg-slate-50 dark:bg-black/25 dark:border-transparent"
            children={<ProjectsBar />}
          />

          <nav
            ref={sideBarRef}
            className="fixed bottom-0 overflow-y-auto p-5 pt-1 pr-1"
            style={{
              top: topBarHeight,
              left: projectsBarWidth,
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
            <div className="shrink-0 overflow-y-auto bg-slate-100/75 dark:bg-slate-900/25 border-r dark:border-transparent">
              <ProjectsBar onButtonClick={() => setOffcanvasSidebarVisible(false)} />
            </div>

            <div className="p-3 pl-5 overflow-y-auto flex items-start gap-2">
              <Sidebar onButtonClick={() => setOffcanvasSidebarVisible(false)} />

              <button
                type="button"
                className="btn btn-transparent rounded-full p-2 aspect-square sticky top-0"
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
          ref={multiplexRefs([formattingBarRef, formattingBarSizeRef])}
          className="fixed bottom-0 right-0 p-5 pt-1 pl-1 overflow-y-auto flex"
          style={{ top: topBarHeight }}
        />
      )}

      <main
        className="min-h-screen flex flex-col"
        style={{
          paddingTop: topBarHeight,
          paddingLeft: projectsBarWidth + sideBarWidth,
          paddingRight: centreView
            ? Math.max(formattingBarWidth, projectsBarWidth + sideBarWidth)
            : formattingBarWidth,
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
