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
      <h4 className="select-none h3">Project name</h4>

      <input
        type="text"
        {...nameProps}
        required
        className="text-input text-input-modal"
        placeholder="My Project"
      />
    </label>
  );
};
