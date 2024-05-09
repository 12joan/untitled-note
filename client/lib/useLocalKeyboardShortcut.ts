import { LocalKeyboardShortcutCommandId } from '~/lib/commands';
import { compareKeyboardShortcut } from '~/lib/keyboardShortcuts/compareKeyboardShortcut';
import { useLocalKeyboardShortcutCommand } from '~/lib/keyboardShortcuts/overridden';
import { useEventListener } from '~/lib/useEventListener';

export const useLocalKeyboardShortcut = (
  target: EventTarget | null,
  id: LocalKeyboardShortcutCommandId,
  callback: (event: KeyboardEvent) => void,
  useCapture = false
) => {
  const {
    enabled = true,
    keyboardShortcut: { config, sequential },
  } = useLocalKeyboardShortcutCommand(id);

  useEventListener(
    target,
    'keydown',
    (event) => {
      if (
        enabled &&
        !event.defaultPrevented &&
        config &&
        compareKeyboardShortcut(config, event, sequential)
      ) {
        callback(event);
      }
    },
    [enabled, config, sequential, callback],
    useCapture
  );
};
