import React from 'react';
import { useLocalProject } from '~/lib/useLocalProject';
import { useNormalizedInput } from '~/lib/useNormalizedInput';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';

export const EditProjectName = () => {
  const [localProject, updateProject] = useLocalProject();

  const {
    value: name,
    props: nameProps,
    isValid: nameIsValid,
    resetValue: resetName,
  } = useNormalizedInput({
    initial: localProject.name,
    normalize: (name) => name.trim(),
    validate: (name) => name.trim().length > 0,
  });

  useWaitUntilSettled(
    name,
    () => {
      if (!nameIsValid) {
        return;
      }

      updateProject({ name }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        resetName();
      });
    },
    { fireOnUnmount: true }
  );

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
