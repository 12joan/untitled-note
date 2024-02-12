import React, { useMemo } from 'react';
import { EditorStyle } from '~/lib/types';

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
      <div className="grid gap-2 md:grid-cols-3 focus-visible-within:focus-ring ring-offset-4 rounded-lg">
        {options.map((option) => (
          <label
            key={option}
            className="btn border rounded-lg p-3 flex gap-2 items-center data-active:focus-ring data-active:border-transparent"
            data-active={option === value}
          >
            <input
              type="radio"
              name="editor-style"
              className="sr-only"
              checked={option === value}
              onChange={() => onChange(option)}
            />

            <div className="flex-shrink-0 w-5 h-5 border rounded-full data-active:bg-primary-500 data-active:dark:bg-primary-400 data-active:border-0 data-active:bg-tick bg-[length:90%] bg-center bg-no-repeat" />

            {labels[option ?? 'null']}
          </label>
        ))}
      </div>

      {description && (
        <p className="text-plain-500 dark:text-plain-400">{description}</p>
      )}
    </>
  );
};
