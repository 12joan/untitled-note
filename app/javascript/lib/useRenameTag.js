import useInputModal from '~/lib/useInputModal'
import TagsAPI from '~/lib/resources/TagsAPI'
import { handleRenameTagError } from '~/lib/handleErrors'
import { useContext } from '~/lib/context'

const useRenameTag = () => {
  const { projectId } = useContext()

  const [modal, openModal] = useInputModal({
    title: 'Rename tag',
    inputLabel: 'Tag name',
    inputPlaceholder: 'Enter new tag name',
    confirmLabel: 'Rename',
    autoSelect: true,
  })

  const renameTag = ({ id, text }) => openModal({
    initialValue: text,
    onConfirm: newText => handleRenameTagError(
      TagsAPI(projectId).update({ id, text: newText })
    ),
  })

  return [modal, renameTag]
}

export default useRenameTag
