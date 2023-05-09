import { RefObject } from 'react';

export interface CycleFocusOptions {
  sectionRefs: RefObject<HTMLElement | null>[];
}

export const cycleFocus = ({ sectionRefs }: CycleFocusOptions) => {
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

  const newSectionIndex = (currentSectionIndex + 1) % visibleSections.length;

  visibleSections[newSectionIndex]?.focus();
};
