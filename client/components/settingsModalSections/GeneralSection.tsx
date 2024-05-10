import React from 'react';
import { useSettings } from '~/lib/settings';
import { RadioCard, RadioCardGroup } from '../RadioCardGroup';

const recentsTypeOptions = [
  ['viewed', 'Recently viewed'],
  ['modified', 'Recently modified'],
];

export const GeneralSection = () => {
  const [recentsType, setRecentsType] = useSettings('recents_type');

  return (
    <div className="space-y-2">
      <h4 className="h3 select-none">Recent documents</h4>

      <RadioCardGroup
        value={recentsType}
        onValueChange={setRecentsType}
        className="md:grid-cols-2"
      >
        {recentsTypeOptions.map(([value, label]) => (
          <RadioCard
            key={value}
            value={value}
            className="bg-page-bg-light dark:bg-page-bg-dark"
          >
            {label}
          </RadioCard>
        ))}
      </RadioCardGroup>

      <p>
        Determine whether recently viewed or recently modified documents are
        shown in the sidebar and on the overview page.
      </p>
    </div>
  );
};
