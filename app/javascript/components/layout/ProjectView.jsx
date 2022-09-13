import React, { useState, useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useElementSize from '~/lib/useElementSize'

import CloseIcon from '~/components/icons/CloseIcon'
import TopBar from '~/components/layout/TopBar'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import FormattingToolbar from '~/components/layout/FormattingToolbar'
import OverviewView from '~/components/layout/OverviewView'
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

  const { ChildView, centreView, showFormattingToolbar } = {
    overview: {
      ChildView: OverviewView,
      centreView: false,
      showFormattingToolbar: false,
    },
    editor: {
      ChildView: EditorView,
      centreView: isXl,
      showFormattingToolbar: true,
    },
  }[childView.type]

  return (
    <>
      <nav
        ref={projectsBarRef}
        className="fixed top-0 bottom-0 left-0 overflow-y-auto border-r p-3 bg-slate-100 dark:bg-black/25 dark:border-transparent w-20"
        style={{
          display: isMd ? undefined : 'none',
        }}
        children={<ProjectsBar />}
      />

      <TopBar
        ref={topBarRef}
        style={{ left: projectsBarWidth }}
        showSidebarButton={!isMd && !offcanvasSidebarVisible}
        onSidebarButtonClick={() => setOffcanvasSidebarVisible(true)}
      />

      <Dialog
        static
        open={offcanvasSidebarVisible}
        onClose={() => setOffcanvasSidebarVisible(false)}
        className={`relative z-20 ${offcanvasSidebarVisible ? '' : 'pointer-events-none'}`}
        aria-hidden={!offcanvasSidebarVisible}
      >
        <div className="fixed inset-0">
          <Dialog.Panel
            className="max-w-full absolute top-0 left-0 bottom-0 bg-slate-50/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-dialog transition-[transform,opacity] flex duration-300"
            style={{
              transform: offcanvasSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
              opacity: offcanvasSidebarVisible ? 1 : 0,
            }}
          >
            <div className="shrink-0 p-3 w-20 overflow-y-auto bg-slate-200/75 dark:bg-slate-900/25 border-r dark:border-transparent">
              <ProjectsBar />
            </div>

            <div className="p-3 pl-5 overflow-y-auto flex items-start gap-2">
              <Sidebar />

              <button
                type="button"
                className="btn btn-transparent rounded-full p-2 aspect-square sticky top-0"
                onClick={() => setOffcanvasSidebarVisible(false)}
              >
                <CloseIcon size="1.25em" ariaLabel="Close" />
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <nav
        ref={sideBarRef}
        className="fixed bottom-0 overflow-y-auto p-5 pr-1"
        style={{
          top: topBarHeight,
          left: projectsBarWidth,
          display: isMd ? undefined : 'none',
        }}
        children={<Sidebar />}
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
      >
        <ChildView
          topBarHeight={topBarHeight}
          {...childView.props}
        />
      </main>
    </>
  )
}

export default ProjectView
