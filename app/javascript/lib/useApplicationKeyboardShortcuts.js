import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'
import { projectPath } from '~/lib/routes'
import useNewDocument from '~/lib/useNewDocument'

const useApplicationKeyboardShortcuts = ({ sectionRefs, setSearchModalVisible }) => {
  const { projects } = useContext()
  const navigate = useNavigate()
  const createNewDocument = useNewDocument()

  // Switch project
  useGlobalKeyboardShortcut(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(n => [`Meta${n}`, `MetaShift${n}`]),
    event => {
      const index = Number(event.key) - 1
      const project = projects.filter(project => !project.archived_at)[index]

      if (project) {
        event.preventDefault()
        event.stopPropagation()
        navigate(projectPath(project.id))
      }
    },
    [projects]
  )

  // New document
  useGlobalKeyboardShortcut('MetaShiftN', event => {
    event.preventDefault()
    event.stopPropagation()
    createNewDocument()
  }, [])

  // Search
  useGlobalKeyboardShortcut(['MetaK', 'MetaJ', 'MetaG'], event => {
    event.preventDefault()
    event.stopPropagation()
    setSearchModalVisible(visible => !visible)
  }, [])

  // Move focus between sections
  useGlobalKeyboardShortcut('AltF6', event => {
    event.preventDefault()
    event.stopPropagation()

    const visibleSections = sectionRefs.filter(
      ({ current: section }) => section && section.offsetParent !== null
    ).map(({ current }) => current)

    let currentSectionIndex = visibleSections.findIndex(
      section => section.contains(document.activeElement)
    )

    if (currentSectionIndex === -1) {
      const focusTrap = document.activeElement.closest('[data-focus-trap="true"]')

      if (focusTrap) {
        return
      } else {
        currentSectionIndex = 0
      }
    }

    const newSectionIndex = (currentSectionIndex + 1) % visibleSections.length
    visibleSections[newSectionIndex].focus()
  }, [sectionRefs])
}

export default useApplicationKeyboardShortcuts
