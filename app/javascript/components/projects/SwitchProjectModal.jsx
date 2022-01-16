import React from 'react'
import { useRef, useState } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import localeIncludes from 'lib/localeIncludes'

import Modal from 'components/Modal'
import NavLink from 'components/NavLink'

const SwitchProjectModal = props => {
  const { projects } = useContext()
  const modal = useRef(null)
  const [formKey, remountForm] = useRemountKey()
  const [filterText, setFilterText] = useState('')

  const filteredProjects = projects.filter(project => localeIncludes(project.name, filterText, { sensitivity: 'base' }))

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      // Hacky solution until selection via arrow keys is introduced
      document.querySelector('#switch-project-modal .project-list .stretched-link')?.click?.()
    }
  }

  return (
    <Modal
      ref={modal}
      id="switch-project-modal"
      title="Projects"
      centered={false}
      onShow={remountForm}>
      <React.Fragment key={formKey}>
        <div className="d-grid d-sm-flex gap-2 mb-3">
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Filter projects"
              aria-label="Filter projects"
              value={filterText}
              onChange={event => setFilterText(event.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus />
          </div>

          <button
            type="button"
            className="btn btn-light text-nowrap"
            data-bs-toggle="modal"
            data-bs-target="#new-project-modal">
            New Project
          </button>
        </div>

        <div className="project-list list-group list-group-flush border-top border-bottom mx-n4">
          {
            filteredProjects.length === 0
              ? <div className="text-muted text-center px-4 py-3">No matching projects</div>
              : filteredProjects.map(project => (
                <div key={project.id} className="list-group-item list-group-item-action layout-row align-items-center px-4 py-3">
                  <h5 className="fw-normal mb-0">{project.name}</h5>
                  <ChevronRight className="bi ms-auto" />
                  <NavLink
                    className="stretched-link"
                    params={{ projectId: project.id, keywordId: undefined, documentId: undefined }}
                    onClick={() => modal.current.hide()} />
                </div>
              ))
          }
        </div>
      </React.Fragment>
    </Modal>
  )
}

export default SwitchProjectModal
