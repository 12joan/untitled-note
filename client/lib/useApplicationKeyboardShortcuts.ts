import { useDeployIICs } from '~/lib/iic';
import { compareKeyboardShortcut } from '~/lib/keyboardShortcuts/compareKeyboardShortcut';
import { useKeyboardShortcuts } from '~/lib/keyboardShortcuts/useKeyboardShortcuts';
import { useEventListener } from '~/lib/useEventListener';

export const useApplicationKeyboardShortcuts = () => {
  const [iicElements, deployIIC] = useDeployIICs();
  const keyboardShortcuts = useKeyboardShortcuts();

  useEventListener(
    document,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      keyboardShortcuts.some(
        ({ config, sequential, action, overrideAction }) => {
          if (config && compareKeyboardShortcut(config, event, sequential)) {
            deployIIC(overrideAction ? overrideAction(event) : action);
            event.preventDefault();
            return true;
          }

          return false;
        }
      );
    },
    [keyboardShortcuts]
  );

  return iicElements;
};
