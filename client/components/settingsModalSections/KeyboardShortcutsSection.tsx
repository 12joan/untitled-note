import React, { useState, useMemo } from 'react';
import { Tooltip } from '~/components/Tooltip';
import { useEventListener } from '~/lib/useEventListener';
import { useSettings } from '~/lib/settings';
import { KeyboardShortcut, isUsableShortcut, getShortcutLabel, getKeyLabel, isKeyboardShortcut } from '~/lib/keyboardShortcuts';

const shortcutableCommands: [string, string][] = [
  ['search', 'Search'],
  ['newProject', 'New project'],
  ['newFile', 'New file'],
  ['newFolder', 'New folder'],
  ['rename', 'Rename'],
  ['delete', 'Delete'],
  ['move', 'Move'],
  ['copy', 'Copy'],
  ['duplicate', 'Duplicate'],
  ['download', 'Download'],
  ['upload', 'Upload'],
  ['selectAll', 'Select all'],
];

// TODO: Change defaults based on platform and browser
const defaultKeyboardShortcuts: Record<string, KeyboardShortcut> = {
  search: { key: 'k', metaKey: true },
};

export const KeyboardShortcutsSection = () => {
  const [userKeyboardShortcuts, setUserKeyboardShortcuts] = useSettings('userKeyboardShortcuts');

  const keyboardShortcuts = useMemo(() => ({
    ...defaultKeyboardShortcuts,
    ...userKeyboardShortcuts,
  }), [userKeyboardShortcuts]);

  const [recordingCommand, setRecordingCommand] = useState<string | null>(null);

  const setRecordingKeyboardShortcut = recordingCommand ? ((shortcut: KeyboardShortcut | null) => {
    setUserKeyboardShortcuts({
      ...userKeyboardShortcuts,
      [recordingCommand]: shortcut,
    });
  }) : null;

  useEventListener(
    document.body,
    'keydown',
    (event: KeyboardEvent) => {
      if (recordingCommand === null) return;
      if (event.key === 'Tab') return;

      event.preventDefault();

      const isModified = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

      if (!isModified) {
        if (event.key === 'Backspace') {
          setRecordingKeyboardShortcut!(null);
          setRecordingCommand(null);
          return;
        }

        if (event.key === 'Escape') {
          setRecordingCommand(null);
          return;
        }
      }

      const isDuplicate = Object.entries(keyboardShortcuts).some(([command, shortcut]) => (
        command !== recordingCommand && shortcut && isKeyboardShortcut(shortcut, event)
      ));

      if (!isUsableShortcut(event) || isDuplicate) {
        // TODO: Shake animation + ARIA alert
        console.log(isDuplicate ? 'Duplicate shortcut' : 'Invalid shortcut');
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

      setRecordingCommand(null);
    },
    [recordingCommand],
    true
  );

  return (
    <>
      <ul className="list-group">
        {shortcutableCommands.map(([command, commandLabel]) => {
          const isRecording = recordingCommand === command;
          const keyboardShortcut: KeyboardShortcut | null = keyboardShortcuts[command] || null;

          return (
            <div key={command} className="group flex">
              <Tooltip
                content={
                  <div className="space-y-2 text-sm font-normal text-center">
                    <p>Type a shortcut</p>
                    <p><strong className="font-medium">Backspace</strong>: No shortcut</p>
                    <p><strong className="font-medium">Escape</strong>: Cancel</p>
                  </div>
                }
                placement="bottom"
                visible={isRecording}
              >
                <button
                  type="button"
                  className="list-group-item bg-slate-50/90 dark:bg-slate-900/90 flex justify-between no-focus-ring cursor-pointer hover:bg-slate-100/90 dark:hover:bg-slate-850/90"
                  onClick={() => setRecordingCommand(isRecording ? null : command)}
                  onBlur={() => setRecordingCommand(null)}
                >
                  <span>{commandLabel}</span>
                  <span
                    className="btn btn-link group-focus-visible-within:focus-ring group-hover:btn-link-hover"
                  >
                    {isRecording ? <>Recording&hellip;</> : (
                      keyboardShortcut ? getShortcutLabel(keyboardShortcut) : 'Add shortcut'
                    )}
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
        onClick={() => setUserKeyboardShortcuts({})}
      >
        Reset to defaults
      </button>
    </>
  );
};
