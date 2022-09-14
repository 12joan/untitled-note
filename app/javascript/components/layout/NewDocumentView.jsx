import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useUnmounting from '~/lib/useUnmounting'
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI'
import { projectPath, documentPath } from '~/lib/routes'

const NewDocumentView = () => {
  const navigate = useNavigate()
  const { projectId } = useContext()

  const unmounting = useUnmounting()
  const unlessUnmounting = f => (...args) => unmounting.current || f(...args)

  useEffect(() => {
    BlankDocumentAPI(projectId).create()
      .then(unlessUnmounting(doc => navigate(documentPath(projectId, doc.id), { replace: true })))
      .catch(unlessUnmounting(error => {
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
