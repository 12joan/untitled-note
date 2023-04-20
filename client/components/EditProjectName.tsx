import React from 'react'

import { useContext } from '~/lib/context'
import { useIsMounted } from '~/lib/useIsMounted'
import { useNormalizedInput } from '~/lib/useNormalizedInput'
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled'
import { updateProject } from '~/lib/apis/project'
import { retry } from '~/lib/retry'
import { handleUpdateProjectError } from '~/lib/handleErrors'
import { Project } from '~/lib/types'

export const EditProjectName = () => {
  const { project } = useContext() as { project: Project }

  const isMounted = useIsMounted()

  const {
    value: name,
    props: nameProps,
    isValid: nameIsValid,
    resetValue: resetName,
  } = useNormalizedInput({
    initial: project.name,
    normalize: name => name.trim(),
    validate: name => name.trim().length > 0,
  })

  useWaitUntilSettled(name, () =>  {
    if (!nameIsValid) {
      return
    }

    handleUpdateProjectError(
      retry(
        () => updateProject(project.id, { name }),
        { shouldRetry: isMounted }
      )
    ).catch(error => {
      console.error(error)
      resetName()
    })
  })

  return (
    <label className="block space-y-2">
      <h2 className="font-medium select-none">Project name</h2>

      <input
        type="text"
        {...nameProps}
        required
        className="block w-full border rounded-lg px-3 py-2 bg-page-bg-light dark:bg-page-bg-dark"
        placeholder="My Project"
      />
    </label>
  )
};
