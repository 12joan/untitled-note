import React, { useState } from 'react';
import { createToast } from '~/lib/createToast';
import { groupedClassNames } from '~/lib/groupedClassNames';
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
import { useTemporaryState } from '~/lib/useTemporaryState';
import { Tooltip } from '~/components/Tooltip';

type RecordShortcutError = 'duplicate' | 'notSequential' | 'invalid';

const recordShortcutErrorMessages: Record<RecordShortcutError, string> = {
  duplicate: 'This shortcut is already in use.',
  notSequential: 'The shortcut must end in 1.',
  invalid: 'This shortcut cannot be used.',
};

export const KeyboardShortcutsSection = () => {
  const keyboardShortcuts = useKeyboardShortcuts();
  const [keyboardShortcutOverrides, setKeyboardShortcutOverrides] = useSettings(
    'keyboardShortcutOverrides'
  );

  const [recordingId, setRecordingId] = useState<string | null>(null);

  const [isShaking, setIsShaking] = useTemporaryState(false, {
    resetAfter: 375,
    dependencies: [recordingId],
  });

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

      const error: RecordShortcutError | null = (() => {
        const isDuplicate = keyboardShortcuts.some(
          ({ id, config }) =>
            id !== recordingId &&
            config &&
            compareKeyboardShortcut(config, event)
        );

        if (isDuplicate) return 'duplicate';

        const isSequential = keyboardShortcuts.some(
          ({ id, sequential }) => id === recordingId && sequential
        );

        if (isSequential && event.code !== 'Digit1') return 'notSequential';

        if (!isUsableShortcut(event)) return 'invalid';

        return null;
      })();

      if (error) {
        createToast({
          title: 'Failed to record shortcut',
          message: recordShortcutErrorMessages[error],
          autoClose: 'fast',
          ariaLive: 'assertive',
        });

        setIsShaking(true);

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

                  <span
                    className={groupedClassNames({
                      btn: 'btn btn-link',
                      hocus:
                        'group-focus-visible-within:focus-ring group-hover:btn-link-hover',
                      misc: 'shrink-0',
                      shake: isShaking && isRecording && 'animate-shake',
                    })}
                  >
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
