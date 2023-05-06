import { useMemo, DependencyList, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from '~/lib/context';
import { projectPath } from '~/lib/routes';
import { Project } from '~/lib/types';
import { useNewDocument } from '~/lib/useNewDocument';
import { KeyboardShortcutContext } from '~/lib/types';
import { useKeyboardShortcuts, compareKeyboardShortcut } from '~/lib/keyboardShortcuts';
import { useEventListener } from '~/lib/useEventListener';
import { CycleFocusOptions, cycleFocus } from '~/lib/cycleFocus';

export interface UseApplicationKeyboardShortcutsOptions extends Pick<KeyboardShortcutContext,
  | 'toggleSearchModal'
>, CycleFocusOptions {
}

export const useApplicationKeyboardShortcuts = ({
  toggleSearchModal,
  sectionRefs,
}: UseApplicationKeyboardShortcutsOptions, deps: DependencyList) => {
  const { projects } = useContext() as {
    projects: Project[];
  };

  const navigate = useNavigate();
  const createNewDocument = useNewDocument();

  const switchProject = useCallback((n: number) => {
    const project = projects.filter((project) => !project.archived_at)[n - 1];

    if (project) {
      navigate(projectPath({ projectId: project.id }));
    }
  }, [projects]);

  const context: KeyboardShortcutContext = useMemo(() => ({
    toggleSearchModal,
    createNewDocument,
    switchProject,
    cycleFocus: () => cycleFocus({ sectionRefs }),
  }), [...deps, switchProject]);

  const keyboardShortcuts = useKeyboardShortcuts();

  useEventListener(
    document,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      keyboardShortcuts.some(({ sequential, config, action }) => {
        if (config && compareKeyboardShortcut(config, event, sequential)) {
          action(context, event);
          event.preventDefault();
          return true;
        }

        return false;
      });
    },
    [keyboardShortcuts, context],
  );
};
