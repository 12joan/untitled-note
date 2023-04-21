import React from 'react';
import { updateProject } from '~/lib/apis/project';
import { useContext } from '~/lib/context';
import { handleUpdateProjectError } from '~/lib/handleErrors';
import { retry } from '~/lib/retry';
import { Project } from '~/lib/types';
import { useIsMounted } from '~/lib/useIsMounted';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';

export const EditProjectName = () => {
  const { project } = useContext() as { project: Project };

  const isMounted = useIsMounted();

  const {
    value: name,
    props: nameProps,
    isValid: nameIsValid,
    resetValue: resetName,
  } = useNormalizedInput({
    initial: project.name,
    normalize: (name) => name.trim(),
    validate: (name) => name.trim().length > 0,
  });

  useWaitUntilSettled(name, () => {
    if (!nameIsValid) {
      return;
    }

    handleUpdateProjectError(
      retry(() => updateProject(project.id, { name }), {
        shouldRetry: isMounted,
      })
    ).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      resetName();
    });
  });

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
  );
};
