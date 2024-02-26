import React, { useMemo } from 'react';
import { EditorStyle } from '~/lib/types';
import { RadioCard, RadioCardGroup } from './RadioCardGroup';

const descriptions: Record<EditorStyle, string> = {
  casual: 'The casual style is designed for taking notes and casual writing.',
  literary:
    'The literary style is designed for writing long-form content. Paragraphs are indented and spaced closer together, text is justified, and a serif font is used.',
};

export interface EditorStyleInputProps<Nullable extends boolean> {
  value: Nullable extends true ? EditorStyle | null : EditorStyle;
  onChange: (
    value: Nullable extends true ? EditorStyle | null : EditorStyle
  ) => void;
  syncWithOption: Nullable extends true ? string : null;
}

export const EditorStyleInput = <Nullable extends boolean>({
  value,
  onChange,
  syncWithOption,
}: EditorStyleInputProps<Nullable>) => {
  type T = Nullable extends true ? EditorStyle | null : EditorStyle;

  const options = useMemo(
    () =>
      syncWithOption ? [null, 'casual', 'literary'] : ['casual', 'literary'],
    [syncWithOption]
  ) as T[];

  const labels: Record<EditorStyle | 'null', string> = useMemo(
    () => ({
      null: `Sync with ${syncWithOption}`,
      casual: 'Casual',
      literary: 'Literary',
    }),
    [syncWithOption]
  );

  const description = value && descriptions[value];

  return (
    <>
      <RadioCardGroup
        className="md:grid-cols-3"
        value={value}
        onValueChange={onChange}
      >
        {options.map((option) => (
          <RadioCard key={option} value={option}>
            {labels[option ?? 'null']}
          </RadioCard>
        ))}
      </RadioCardGroup>

      {description && (
        <p className="text-plain-500 dark:text-plain-400">{description}</p>
      )}
    </>
  );
};
