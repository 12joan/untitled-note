import React, { useRef, useState } from 'react';
import { KeyboardShortcutCommand } from '~/lib/commands';
import { isHotkey } from '~/lib/editor/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { compareKeyboardShortcut } from '~/lib/keyboardShortcuts/compareKeyboardShortcut';
import { getKeyboardShortcutLabel } from '~/lib/keyboardShortcuts/getKeyboardShortcutLabel';
import { getKeyLabel } from '~/lib/keyboardShortcuts/getKeyLabel';
import { isUsableShortcut } from '~/lib/keyboardShortcuts/isUsableShortcut';
import { useAllKeyboardShortcutCommands } from '~/lib/keyboardShortcuts/overridden';
import { mergeRefs } from '~/lib/refUtils';
import { useSettings } from '~/lib/settings';
import { createToast } from '~/lib/toasts';
import { KeyboardShortcutConfig } from '~/lib/types';
import { useEventListener } from '~/lib/useEventListener';
import { useFocusOut } from '~/lib/useFocusOut';
import { useTemporaryState } from '~/lib/useTemporaryState';
import {
  Dropdown,
  DropdownItem,
  dropdownItemClassNames,
} from '~/components/Dropdown';
import DeleteIcon from '~/components/icons/DeleteIcon';
import KeyboardShortcutsIcon from '~/components/icons/KeyboardShortcutsIcon';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';

type RecordShortcutError =
  | 'noModifier'
  | 'duplicate'
  | 'notSequential'
  | 'invalid';

const recordShortcutErrorMessages: Record<RecordShortcutError, string> = {
  noModifier: 'The shortcut must include a modifier key.',
  duplicate: 'This shortcut is already in use.',
  notSequential: 'The shortcut must end in 1.',
  invalid: 'This shortcut cannot be used.',
};

export const KeyboardShortcutsSection = () => {
  const commands = useAllKeyboardShortcutCommands();

  const [keyboardShortcutOverrides, setKeyboardShortcutOverrides] = useSettings(
    'keyboard_shortcut_overrides'
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

      if (
        !(event.target as HTMLElement).dataset.keyboardShortcutItem &&
        ['Enter', ' '].includes(event.key)
      )
        return;

      const recordingCommand = commands.find(
        (command) => command.id === recordingId
      );
      if (!recordingCommand) return;

      event.preventDefault();

      if (isHotkey('backspace', event)) {
        setRecordingKeyboardShortcut!(null);
        setRecordingId(null);
        return;
      }

      if (isHotkey('escape', event)) {
        setRecordingId(null);
        return;
      }

      const error: RecordShortcutError | null = (() => {
        const isModified =
          event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
        if (!isModified) return 'noModifier';

        const isDuplicate = commands.some(
          ({ id, keyboardShortcut: { config, allowConflictOutsideGroup } }) =>
            id !== recordingId &&
            allowConflictOutsideGroup ===
              recordingCommand.keyboardShortcut.allowConflictOutsideGroup &&
            config &&
            compareKeyboardShortcut(config, event)
        );
        if (isDuplicate) return 'duplicate';

        if (
          recordingCommand.keyboardShortcut.sequential &&
          event.code !== 'Digit1'
        )
          return 'notSequential';

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
        {commands.map((command) => {
          return (
            <KeyboardShortcutItem
              key={command.id}
              keyboardShortcutCommand={command}
              isRecording={recordingId === command.id}
              setIsRecording={(isRecording) =>
                setRecordingId(isRecording ? command.id : null)
              }
              isShaking={isShaking}
              removeKeyboardShortcut={() =>
                setRecordingKeyboardShortcut?.(null)
              }
            />
          );
        })}
      </ul>

      <div>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => setKeyboardShortcutOverrides({})}
        >
          Reset to defaults
        </button>
      </div>
    </>
  );
};

interface KeyboardShortcutItemProps {
  keyboardShortcutCommand: KeyboardShortcutCommand;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  isShaking: boolean;
  removeKeyboardShortcut: () => void;
}

const KeyboardShortcutItem = ({
  keyboardShortcutCommand: {
    label,
    keyboardShortcut: { config, hint, sequential = false },
  },
  isRecording,
  setIsRecording,
  isShaking,
  removeKeyboardShortcut,
}: KeyboardShortcutItemProps) => {
  const [focusOutRef, focusOutProps] = useFocusOut<HTMLDivElement>(() =>
    setIsRecording(false)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLSpanElement>(null);

  return (
    <div
      ref={mergeRefs([containerRef, focusOutRef])}
      className="group flex"
      {...focusOutProps}
    >
      <button
        type="button"
        className="text-left list-group-item bg-plain-50/90 dark:bg-plain-900/90 flex items-center gap-2 justify-between no-focus-ring cursor-pointer hover:bg-plain-100/90 dark:hover:bg-plain-850/90 stretch-target"
        onClick={() => setIsRecording(!isRecording)}
        data-keyboard-shortcut-item
      >
        <div>
          <div>{label}</div>
          <div className="text-sm text-plain-500 dark:text-plain-400">
            {hint}
          </div>
        </div>
        <span
          ref={popoverRef}
          className={groupedClassNames({
            btn: 'btn btn-link',
            hocus:
              'group-stretch-focus-visible:focus-ring group-hover:btn-link-hover',
            misc: 'shrink-0',
          })}
        >
          {(() => {
            if (isRecording) return <>Recording&hellip;</>;
            if (config) return getKeyboardShortcutLabel(config);
            return 'Add shortcut';
          })()}
        </span>
      </button>

      <Dropdown
        reference={popoverRef}
        appendTo={containerRef.current ?? undefined}
        items={
          <KeyboardShortcutDropdown
            sequential={sequential}
            onRemove={() => {
              removeKeyboardShortcut();
              setIsRecording(false);
            }}
            onCancel={() => setIsRecording(false)}
          />
        }
        placement="bottom"
        className={{
          shake: isShaking && isRecording && 'animate-shake',
        }}
        visible={isRecording}
        trigger={undefined}
      />
    </div>
  );
};

interface KeyboardShortcutDropdownProps {
  sequential: boolean;
  onRemove: () => void;
  onCancel: () => void;
}

const KeyboardShortcutDropdown = ({
  sequential,
  onRemove,
  onCancel,
}: KeyboardShortcutDropdownProps) => {
  return (
    <div
      className="contents cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={groupedClassNames(dropdownItemClassNames, {
          display: 'block',
          hocusBackgroundColor: undefined,
          textAlign: 'text-center',
          padding: 'py-3 px-5',
        })}
      >
        <div className="flex items-center justify-center my-1">
          <div className="rounded-full bg-black/[0.03] dark:bg-white/5 text-plain-500 dark:text-plain-400 p-3">
            <KeyboardShortcutsIcon noAriaLabel size="1.25em" />
          </div>
        </div>

        <h3 className="text-lg font-medium">Record shortcut</h3>

        <p className="text-sm text-plain-500 dark:text-plain-400">
          Type a keyboard shortcut
        </p>

        {sequential && (
          <p className="mt-2">
            <span className="text-xs bg-plain-200 dark:bg-plain-800 rounded px-2 py-1">
              Must end in 1
            </span>
          </p>
        )}
      </div>

      <DropdownItem icon={DeleteIcon} onClick={onRemove}>
        Remove shortcut
      </DropdownItem>

      <DropdownItem icon={LargeCloseIcon} onClick={onCancel}>
        Stop recording
      </DropdownItem>
    </div>
  );
};
