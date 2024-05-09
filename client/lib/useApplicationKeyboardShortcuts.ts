import { useDeployIICs } from '~/lib/iic';
import { compareKeyboardShortcut } from '~/lib/keyboardShortcuts/compareKeyboardShortcut';
import { useGlobalKeyboardShortcutCommands } from '~/lib/keyboardShortcuts/overridden';
import { useEventListener } from '~/lib/useEventListener';

export const useApplicationKeyboardShortcuts = () => {
  const [iicElements, deployIIC] = useDeployIICs();
  const keyboardShortcutCommands = useGlobalKeyboardShortcutCommands();

  useEventListener(
    document,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      keyboardShortcutCommands.some(
        ({
          keyboardShortcut: { config, sequential, overrideAction },
          action,
        }) => {
          if (config && compareKeyboardShortcut(config, event, sequential)) {
            deployIIC(overrideAction ? overrideAction(event) : action());
            event.preventDefault();
            return true;
          }

          return false;
        }
      );
    },
    [keyboardShortcutCommands]
  );

  return iicElements;
};
