import React, { useState } from 'react';
import {
  compareKeyboardShortcut,
  getKeyLabel,
  getShortcutLabel,
  isUsableShortcut,
  KeyboardShortcutConfig,
  useKeyboardShortcuts,
} from '~/lib/keyboardShortcuts';
import { useSettings } from '~/lib/settings';
import { useEventListener } from '~/lib/useEventListener';
import { Tooltip } from '~/components/Tooltip';

export const KeyboardShortcutsSection = () => {
  const keyboardShortcuts = useKeyboardShortcuts();
  const [keyboardShortcutOverrides, setKeyboardShortcutOverrides] = useSettings(
    'keyboardShortcutOverrides'
  );

  const [recordingId, setRecordingId] = useState<string | null>(null);

  const setRecordingKeyboardShortcut = recordingId
    ? (config: KeyboardShortcutConfig | null) => {
        setKeyboardShortcutOverrides({
          ...keyboardShortcutOverrides,
          [recordingId]: config,
        });
      }
    : null;

  useEventListener(
    document.body,
    'keydown',
    (event: KeyboardEvent) => {
      if (recordingId === null) return;
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
        return;

      event.preventDefault();

      const isModified =
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

      if (!isModified) {
        if (event.key === 'Backspace') {
          setRecordingKeyboardShortcut!(null);
          setRecordingId(null);
          return;
        }

        if (event.key === 'Escape') {
          setRecordingId(null);
          return;
        }
      }

      const isDuplicate = keyboardShortcuts.some(
        ({ id, config }) =>
          id !== recordingId && config && compareKeyboardShortcut(config, event)
      );

      const isSequential = keyboardShortcuts.some(
        ({ id, sequential }) => id === recordingId && sequential
      );

      const satisfiesSequential = !isSequential || event.code === 'Digit1';

      if (!isUsableShortcut(event) || isDuplicate || !satisfiesSequential) {
        // TODO: Shake animation + ARIA alert
        if (isDuplicate) {
          // eslint-disable-next-line no-console
          console.log('Duplicate shortcut');
        } else if (!satisfiesSequential) {
          // eslint-disable-next-line no-console
          console.log('Must end in 1');
        } else {
          // eslint-disable-next-line no-console
          console.log('Invalid shortcut');
        }

        return;
      }

      setRecordingKeyboardShortcut!({
        key: event.key === 'OS' ? 'Meta' : event.key,
        keyLabel: getKeyLabel(event),
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
      });

      setRecordingId(null);
    },
    [recordingId],
    true
  );

  return (
    <>
      <ul className="list-group">
        {keyboardShortcuts.map(({ id, label, hint, sequential, config }) => {
          const isRecording = recordingId === id;

          return (
            <div key={id} className="group flex">
              <Tooltip
                content={
                  <div className="space-y-2 text-sm font-normal text-center">
                    <p>Type a shortcut</p>
                    {sequential && <p>Must end in 1</p>}
                    <p>
                      <strong className="font-medium">Backspace</strong>: No
                      shortcut
                    </p>
                    <p>
                      <strong className="font-medium">Escape</strong>: Cancel
                    </p>
                  </div>
                }
                placement="bottom"
                visible={isRecording}
              >
                <button
                  type="button"
                  className="text-left list-group-item bg-slate-50/90 dark:bg-slate-900/90 flex items-center gap-2 justify-between no-focus-ring cursor-pointer hover:bg-slate-100/90 dark:hover:bg-slate-850/90"
                  onClick={() => setRecordingId(isRecording ? null : id)}
                  onBlur={() => setRecordingId(null)}
                >
                  <div>
                    <div>{label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {hint}
                    </div>
                  </div>

                  <span className="btn btn-link group-focus-visible-within:focus-ring group-hover:btn-link-hover shrink-0">
                    {(() => {
                      if (isRecording) return <>Recording&hellip;</>;
                      if (config) return getShortcutLabel(config);
                      return 'Add shortcut';
                    })()}
                  </span>
                </button>
              </Tooltip>
            </div>
          );
        })}
      </ul>

      <button
        type="button"
        className="btn btn-link"
        onClick={() => setKeyboardShortcutOverrides({})}
      >
        Reset to defaults
      </button>
    </>
  );
};
