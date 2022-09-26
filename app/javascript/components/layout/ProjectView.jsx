import React, { useState, useRef, useEffect } from 'react'

import { useContext, ContextProvider } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useElementSize from '~/lib/useElementSize'
import { AwaitRedirectComponent } from '~/lib/awaitRedirect'

import { ModalRoot, ModalPanel } from '~/components/Modal'
import CloseIcon from '~/components/icons/CloseIcon'
import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import OverviewView from '~/components/layout/OverviewView'
import EditProjectView from '~/components/layout/EditProjectView'
import RecentlyViewedView from '~/components/layout/RecentlyViewedView'
import EditorView from '~/components/layout/EditorView'

const ProjectView = ({ childView }) => {
  const projectsBarRef = useRef()
  const topBarRef = useRef()
  const sideBarRef = useRef()
  const formattingBarRef = useRef()

  const { width: projectsBarWidth } = useElementSize(projectsBarRef)
  const { height: topBarHeight } = useElementSize(topBarRef)
  const { width: sideBarWidth } = useElementSize(sideBarRef)
  const { width: formattingBarWidth } = useElementSize(formattingBarRef)

  const { isMd, isXl } = useBreakpoints()

  const [offcanvasSidebarVisible, setOffcanvasSidebarVisible] = useState(false)

  useEffect(() => {
    if (isMd) {
      setOffcanvasSidebarVisible(false)
    }
  }, [isMd])

  const {
    ChildView,
    centreView = isXl,
    showFormattingToolbar = false,
  } = {
    awaitRedirect: {
      ChildView: AwaitRedirectComponent,
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
    editor: {
      ChildView: EditorView,
      showFormattingToolbar: true,
    },
  }[childView.type]

  return (
    <ContextProvider formattingToolbarRef={formattingBarRef} topBarHeight={topBarHeight}>
      <nav
        ref={projectsBarRef}
        className="fixed top-0 bottom-0 left-0 overflow-y-auto border-r bg-slate-50 dark:bg-black/25 dark:border-transparent"
        style={{
          display: isMd ? undefined : 'none',
        }}
        children={<ProjectsBar />}
      />

      <TopBar
        ref={topBarRef}
        style={{ left: projectsBarWidth }}
        showSidebarButton={!isMd}
        onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
      />

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
                <CloseIcon size="1.25em" ariaLabel="Close" />
              </button>
            </div>
          </ModalPanel>
        </div>
      </ModalRoot>

      <nav
        ref={sideBarRef}
        className="fixed bottom-0 overflow-y-auto p-5 pt-1 pr-1"
        style={{
          top: topBarHeight,
          left: projectsBarWidth,
          display: isMd ? undefined : 'none',
        }}
        children={<Sidebar />}
      />

      <aside
        ref={formattingBarRef}
        className="fixed bottom-0 right-0 p-5 pt-1 pl-1 overflow-y-auto flex"
        style={{
          top: topBarHeight,
          display: showFormattingToolbar ? undefined : 'none',
        }}
      />

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
