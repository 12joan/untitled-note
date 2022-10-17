import React, { useState } from 'react'

import { useContext } from '~/lib/context'
import useNormalizedInput from '~/lib/useNormalizedInput'
import useWaitUntilSettled from '~/lib/useWaitUntilSettled'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import { handleRenameProjectError } from '~/lib/handleErrors'

const EditProjectName = () => {
  const { project } = useContext()

  const [name, nameProps, nameIsValid] = useNormalizedInput({
    initial: project.name,
    normalize: name => name.trim(),
    validate: name => name.length > 0,
  })

  useWaitUntilSettled(name, () =>  {
    if (!nameIsValid) {
      return
    }

    return handleRenameProjectError(
      ProjectsAPI.update({
        id: project.id,
        name,
      })
    ).then(
      () => ({ retry: false }),
      () => ({ retry: true })
    )
  })

  return (
    <label className="block space-y-2">
      <div className="font-medium select-none">Project name</div>

      <input
        type="text"
        {...nameProps}
        required
        className="block w-full border rounded-lg px-3 py-2 bg-page-bg-light dark:bg-page-bg-dark"
        placeholder="My Project"
      />
    </label>
  )
}

export default EditProjectName
