import React from 'react'
import { useState } from 'react'
import { PencilSquare, ChevronRight } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import localeIncludes from 'lib/localeIncludes'
import useComboBox from 'lib/useComboBox'
import classList from 'lib/classList'

import Modal from 'components/Modal'
import NavLink from 'components/NavLink'

const SwitchProjectForm = props => {
  const { projects } = useContext()
  const [filterText, setFilterText] = useState('')

  const filteredProjects = projects.filter(project => localeIncludes(project.name, filterText, { sensitivity: 'base' }))
  const nthSuggestionId = index => `project-list-item-${index}`

  const { selectedIndex, comboBoxProps, suggestionListProps, nthSuggestionProps, nthKeyboardShortcutBadge } = useComboBox({
    suggestionCount: filteredProjects.length,
    suggestionListId: 'project-list',
    nthSuggestionId,
  })

  return (
    <>
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link text-decoration-none small"
          data-bs-toggle="modal"
          data-bs-target="#new-project-modal">
          <PencilSquare className="bi" /> New Project
        </button>
      </div>

      <div className="d-grid mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter projects"
          aria-label="Filter projects"
          value={filterText}
          autoFocus
          {...comboBoxProps}
          onChange={event => {
            setFilterText(event.target.value)
            comboBoxProps.onChange(event)
          }} />
      </div>

      <div className="project-list list-group list-group-flush border-top border-bottom mx-n4" {...suggestionListProps}>
        {
          filteredProjects.length === 0
            ? <div className="text-muted text-center px-4 py-3">No matching projects</div>
            : filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={classList(["list-group-item list-group-item-action layout-row align-items-center gap-3 px-4 py-3", {
                  active: index === selectedIndex,
                }])}
                {...nthSuggestionProps(index)}>
                {nthKeyboardShortcutBadge(index)}

                <div className="flex-grow-1 layout-row">
                  <h5 className="fw-normal mb-0">{project.name}</h5>
                  <div className="ms-auto"><ChevronRight className="bi" /></div>
                  <NavLink
                    className="stretched-link"
                    tabIndex="-1"
                    params={{ projectId: project.id, keywordId: undefined, documentId: undefined }}
                    data-bs-dismiss="modal" />
                </div>
              </div>
            ))
        }
      </div>
    </>
  )
}

const SwitchProjectModal = props => {
  const [formKey, remountForm] = useRemountKey()

  return (
    <Modal
      id="switch-project-modal"
      title="Projects"
      centered={false}
      onShow={remountForm}>
      <SwitchProjectForm key={formKey} />
    </Modal>
  )
}

export default SwitchProjectModal
