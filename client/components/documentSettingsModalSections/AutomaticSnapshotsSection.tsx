import React from 'react';
import { automaticSnapshotsOptions, AutoSnapshotsOption } from '~/lib/types';
import { useOverrideable } from '~/lib/useOverrideable';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import { DocumentSettingsModalSectionProps } from './types';

const optionLabels: Record<AutoSnapshotsOption | 'null', string> = {
  null: 'Sync with project',
  disabled: 'Never',
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const timeUnits: Record<AutoSnapshotsOption | 'null', string | null> = {
  null: null,
  disabled: null,
  hourly: 'hour',
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
};

export const AutomaticSnapshotsSection = ({
  document: doc,
  updateDocument,
}: DocumentSettingsModalSectionProps) => {
  const [selectedOption, setSelectedOption] = useOverrideable(
    doc.auto_snapshots_option
  );

  useWaitUntilSettled(
    selectedOption,
    (newOption) => updateDocument({ auto_snapshots_option: newOption }),
    { fireOnUnmount: true }
  );

  const description = (() => {
    const timeUnit = timeUnits[selectedOption ?? 'null'];

    if (timeUnit) {
      return `A snapshot will be created when you edit the document if it has been at least one ${timeUnit} since the previous snapshot.`;
    }

    if (selectedOption === 'disabled') {
      return 'Snapshots will not be created automatically. You can still create snapshots manually using the document menu.';
    }

    return null;
  })();

  return (
    <div className="space-y-2">
      <h3 className="h3 select-none">Frequency</h3>

      <div className="space-y-1">
        {[null, ...automaticSnapshotsOptions].map((option) => (
          <label key={option} className="block space-x-2 select-none">
            <input
              type="radio"
              name="frequency"
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
            />

            <span>{optionLabels[option ?? 'null']}</span>
          </label>
        ))}
      </div>

      {description && (
        <p className="text-plain-500 dark:text-plain-400">{description}</p>
      )}
    </div>
  );
};
