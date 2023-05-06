import { useMemo, DependencyList } from 'react';
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
  const { projects, projectId } = useContext() as {
    projects: Project[];
    projectId: string;
  };

  const navigate = useNavigate();
  const createNewDocument = useNewDocument();

  const context: KeyboardShortcutContext = useMemo(() => ({
    toggleSearchModal,
    createNewDocument,
    cycleFocus: () => cycleFocus({ sectionRefs }),
  }), deps);

  const keyboardShortcuts = useKeyboardShortcuts();

  useEventListener(
    document,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      keyboardShortcuts.forEach(({ config, action }) => {
        if (config && compareKeyboardShortcut(config, event)) {
          event.preventDefault();
          action(context);
        }
      });
    },
    [keyboardShortcuts, context],
  );

  // // Switch project
  // useGlobalKeyboardShortcut(
  //   [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((n) => [`Meta${n}`, `MetaShift${n}`]),
  //   (event: KeyboardEvent) => {
  //     const index = Number(event.key) - 1;
  //     const project = projects.filter((project) => !project.archived_at)[index];

  //     if (project) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //       navigate(projectPath({ projectId: project.id }));
  //     }
  //   },
  //   [projects]
  // );
};
