import React from 'react'
import { Link } from 'react-router-dom'

import { ProjectLink } from '~/lib/routes'

import OverviewIcon from '~/components/icons/OverviewIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'

const Sidebar = () => {
  return (
    <div className="w-full max-w-48 space-y-5 pb-3">
      <section className="-ml-3">
        {[
          ['Overview', OverviewIcon, () => navigateToProject()],
          ['New document', NewDocumentIcon, () => {}],
          ['Search', SearchIcon, () => {}],
        ].map(([label, Icon, onClick], index) => (
          <ProjectLink key={index} className="btn btn-transparent w-full px-3 py-2 flex gap-2 items-center">
            <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
              <Icon size="1.25em" noAriaLabel />
            </span>

            {label}
          </ProjectLink>
        ))}
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Pinned documents
        </strong>

        <div className="-ml-3">
          {['Document 1', 'Document 2', 'Document 3'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Recently viewed
        </strong>

        <div className="-ml-3">
          {['Document 4', 'Document 5', 'Document 6'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
          Tags
        </strong>

        <div className="-ml-3">
          {['Tag 1', 'Tag 2', 'Tag 3'].map((label, index) => (
            <button key={index} className="btn btn-transparent w-full px-3 py-1 flex gap-2 items-center">
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Sidebar
