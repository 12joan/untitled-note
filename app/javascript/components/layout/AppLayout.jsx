import React, { useRef } from 'react'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useElementSize from '~/lib/useElementSize'

import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import FormattingToolbar from '~/components/layout/FormattingToolbar'
import OverviewView from '~/components/layout/OverviewView'
import EditorView from '~/components/layout/EditorView'

/*
import ContentArea from '~/components/layout/ContentArea'
import SwitchProjectModal from '~/components/projects/SwitchProjectModal'
import NewProjectModal from '~/components/projects/NewProjectModal'
import EditProjectModal from '~/components/projects/EditProjectModal'
import DeleteProjectModal from '~/components/projects/DeleteProjectModal'
import SearchModal from '~/components/layout/SearchModal'
import TrixDialogs from '~/components/layout/TrixDialogs'
import KeyboardNavigationModal from '~/components/layout/KeyboardNavigationModal'
*/

const AppLayout = () => {
  const { documentId } = useContext()

  const projectsBarRef = useRef()
  const topBarRef = useRef()
  const sideBarRef = useRef()
  const formattingBarRef = useRef()

  const { width: projectsBarWidth } = useElementSize(projectsBarRef)
  const { height: topBarHeight } = useElementSize(topBarRef)
  const { width: sideBarWidth } = useElementSize(sideBarRef)
  const { width: formattingBarWidth } = useElementSize(formattingBarRef)

  const { isMd, isXl } = useBreakpoints()

  const { viewComponent, centreView, showFormattingToolbar } = documentId === undefined
    ? {
      viewComponent: <OverviewView topBarHeight={topBarHeight} />,
      centreView: false,
      showFormattingToolbar: false,
    }
    : {
      viewComponent: <EditorView />,
      centreView: isXl,
      showFormattingToolbar: true,
    }

  return (
    <>
      <ProjectsBar ref={projectsBarRef} />

      <TopBar
        ref={topBarRef}
        style={{ left: projectsBarWidth }}
      />

      <Sidebar
        ref={sideBarRef}
        style={{
          top: topBarHeight,
          left: projectsBarWidth,
          display: isMd ? 'initial' : 'none',
        }}
      />

      <FormattingToolbar
        ref={formattingBarRef}
        style={{
          top: topBarHeight,
          display: showFormattingToolbar ? undefined : 'none',
        }}
      />

      {/* Sample dialog */}
      <div className="fixed inset-0 flex p-5 overflow-y-auto hidden">
        <div className="m-auto inline-block bg-slate-100/50 backdrop-blur-xl shadow-dialog rounded-lg p-5 w-full max-w-sm text-center flex flex-col justify-center gap-5 dark:bg-slate-800/50">
          <h2 className="text-xl font-medium">Add link</h2>

          <label className="space-y-3">
            <span>Enter the URL of the link you want to add</span>

            <input
              type="text"
              className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              placeholder="https://example.com/"
            />
          </label>

          <div className="grid flex-wrap gap-3">
            <button type="button" className="grow bg-black/5 px-3 py-2 rounded-lg hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">Add link</button>
            <button type="button" className="grow bg-black/5 px-3 py-2 rounded-lg hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">Cancel</button>
          </div>
        </div>
      </div>

      <main
        style={{
          paddingTop: topBarHeight,
          paddingLeft: projectsBarWidth + sideBarWidth,
          paddingRight: centreView
            ? Math.max(formattingBarWidth, projectsBarWidth + sideBarWidth)
            : formattingBarWidth,
        }}
        children={viewComponent}
      />
    </>
  )

  /*return (
    <>
      <div className="layout-column position-fixed top-0 bottom-0 start-0 end-0 bg-light">
        <TopBar />

        <div className="layout-row flex-grow-1 overflow-hidden">
          <Sidebar />

          <div className="layout-column flex-grow-1 overflow-hidden">
            <ContentArea key={[projectId, keywordId, documentId]} />
          </div>
        </div>
      </div>

      <SwitchProjectModal />
      <NewProjectModal />
      <EditProjectModal />
      <DeleteProjectModal />
      <SearchModal />
      <TrixDialogs />
      <KeyboardNavigationModal />
    </>
  )*/
}

export default AppLayout
