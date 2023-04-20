import { RefObject, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from '~/lib/context';
import { projectPath } from '~/lib/routes';
import { useGlobalKeyboardShortcut } from '~/lib/useGlobalKeyboardShortcut';
import { useNewDocument } from '~/lib/useNewDocument';
import { Project } from '~/lib/types';

export interface UseApplicationKeyboardShortcutsOptions {
  sectionRefs: RefObject<HTMLElement | null>[];
  toggleSearchModal: () => void;
}

export const useApplicationKeyboardShortcuts = ({
  sectionRefs,
  toggleSearchModal,
}: UseApplicationKeyboardShortcutsOptions) => {
  const { projects, projectId } = useContext() as {
    projects: Project[];
    projectId: string;
  };

  const navigate = useNavigate();
  const createNewDocument = useNewDocument();

  // Switch project
  useGlobalKeyboardShortcut(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((n) => [`Meta${n}`, `MetaShift${n}`]),
    (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      const project = projects.filter((project) => !project.archived_at)[index];

      if (project) {
        event.preventDefault();
        event.stopPropagation();
        navigate(projectPath({ projectId: project.id }));
      }
    },
    [projects]
  );

  // New document
  useGlobalKeyboardShortcut(
    'MetaShiftN',
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      createNewDocument();
    },
    [projectId]
  );

  // Search
  useGlobalKeyboardShortcut(
    ['MetaK', 'MetaJ', 'MetaG'],
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSearchModal();
    },
    []
  );

  // Move focus between sections
  useGlobalKeyboardShortcut(
    'AltF6',
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const visibleSections = sectionRefs
        .filter(({ current: section }) => {
          if (!section) {
            return false;
          }

          if (!document.body.contains(section)) {
            return false;
          }

          if (window.getComputedStyle(section).display === 'none') {
            return false;
          }

          return true;
        })
        .map(({ current }) => current);

      let currentSectionIndex = visibleSections.findIndex((section) =>
        section?.contains(document.activeElement)
      );

      if (currentSectionIndex === -1) {
        const focusTrap = document.activeElement?.closest(
          '[data-focus-trap="true"]'
        );

        if (focusTrap) {
          return;
        }

        currentSectionIndex = 0;
      }

      const newSectionIndex = (
        currentSectionIndex + 1
      ) % visibleSections.length;

      visibleSections[newSectionIndex]?.focus();
    },
    [sectionRefs]
  );
};
