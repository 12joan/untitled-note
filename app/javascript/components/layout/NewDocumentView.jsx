import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useIsMounted from '~/lib/useIsMounted'
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI'
import { projectPath, documentPath } from '~/lib/routes'

const NewDocumentView = () => {
  const navigate = useNavigate()
  const { projectId } = useContext()

  const isMounted = useIsMounted()
  const ifMounted = f => (...args) => isMounted() || f(...args)

  useEffect(() => {
    BlankDocumentAPI(projectId).create()
      .then(unlessUnmounting(doc => navigate(documentPath(projectId, doc.id), { replace: true })))
      .catch(ifMounted(error => {
        // TODO: Display the error somewhere
        console.error(error)
        navigate(projectPath(projectId), { replace: true })
      }))
  }, [])

  return (
    <p>Loading...</p>
  )
}

export default NewDocumentView
