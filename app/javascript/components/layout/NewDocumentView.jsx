import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useIsMounted from '~/lib/useIsMounted'
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI'
import { projectPath, documentPath } from '~/lib/routes'
import { handleCreateDocumentError } from '~/lib/handleErrors'

const NewDocumentView = () => {
  const navigate = useNavigate()
  const { projectId } = useContext()

  const isMounted = useIsMounted()
  const ifMounted = f => (...args) => isMounted() && f(...args)

  useEffect(() => handleCreateDocumentError(
    BlankDocumentAPI(projectId).create()
  ).then(
    ifMounted(doc => navigate(documentPath(projectId, doc.id), { replace: true })),
    ifMounted(() => navigate(projectPath(projectId), { replace: true }))
  ), [])

  return (
    <p>Loading...</p>
  )
}

export default NewDocumentView
