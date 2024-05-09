import { LocalKeyboardShortcutCommandId } from '~/lib/commands';
import { compareKeyboardShortcut } from '~/lib/keyboardShortcuts/compareKeyboardShortcut';
import { useLocalKeyboardShortcutCommand } from '~/lib/keyboardShortcuts/overridden';
import { useEventListener } from '~/lib/useEventListener';

export const useLocalKeyboardShortcut = (
  id: LocalKeyboardShortcutCommandId,
  callback: (event: KeyboardEvent) => void
) => {
  const {
    enabled = true,
    keyboardShortcut: { config, sequential },
  } = useLocalKeyboardShortcutCommand(id);

  useEventListener(
    document,
    'keydown',
    (event: KeyboardEvent) => {
      if (
        enabled &&
        !event.defaultPrevented &&
        config &&
        compareKeyboardShortcut(config, event, sequential)
      ) {
        callback(event);
      }
    },
    [enabled, config, sequential]
  );
};
