import React from 'react'

import { ModalRoot, ModalPanel } from '~/components/Modal'
import ProjectsBar from '~/components/layout/ProjectsBar'
import Sidebar from '~/components/layout/Sidebar'
import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const OffcanavasSidebar = ({ visible, onClose }) => {
  return (
    <ModalRoot open={visible} onClose={onClose}>
      <div className="fixed inset-0">
        <ModalPanel
          className="max-w-full absolute top-0 left-0 bottom-0 bg-slate-50/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-dialog transition-[transform,opacity] flex duration-300"
          style={{
            transform: visible ? 'translateX(0)' : 'translateX(-100%)',
            opacity: visible ? 1 : 0,
          }}
        >
          <div
            className="shrink-0 overflow-y-auto bg-slate-100/75 dark:bg-slate-900/25 border-r dark:border-transparent"
            style={{
              paddingLeft: 'env(safe-area-inset-left)',
            }}
          >
            <ProjectsBar onButtonClick={onClose} />
          </div>

          <div className="p-3 pl-5 overflow-y-auto flex items-start gap-2">
            <Sidebar onButtonClick={onClose} />

            <button
              type="button"
              className="btn btn-no-rounded rounded-full p-2 aspect-square sticky top-0"
              onClick={onClose}
            >
              <LargeCloseIcon size="1.25em" ariaLabel="Close" />
            </button>
          </div>
        </ModalPanel>
      </div>
    </ModalRoot>
  )
}

export default OffcanavasSidebar
