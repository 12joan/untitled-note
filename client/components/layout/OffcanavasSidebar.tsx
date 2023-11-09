import React, { memo, useLayoutEffect, useState } from 'react';
import { useTimeout } from '~/lib/useTimer';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';
import { ProjectsBar } from '~/components/layout/ProjectsBar';
import { Sidebar } from '~/components/layout/Sidebar';
import { ModalPanel, ModalRoot } from '~/components/Modal';

export interface OffcanvasSidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const OffcanavasSidebar = memo(
  ({ visible, onClose }: OffcanvasSidebarProps) => {
    const [display, setDisplay] = useState(visible);
    const [transitionVisible, setTransitionVisible] = useState(visible);

    // Set display to true immediately
    useLayoutEffect(() => {
      if (visible) {
        setDisplay(true);
      }
    }, [visible]);

    // Set display to false when transition is complete
    useTimeout(
      () => {
        if (!visible) {
          setDisplay(false);
        }
      },
      300,
      [visible]
    );

    // Set transitionVisible to true an instant after display is set to true
    useTimeout(
      () => {
        setTransitionVisible(visible);
      },
      0,
      [visible]
    );

    return (
      <ModalRoot open={visible} onClose={onClose}>
        <div className="fixed inset-0" data-focus-trap={visible}>
          <ModalPanel
            className="max-w-full absolute top-0 left-0 bottom-0 bg-plain-50/75 dark:bg-plain-800/75 backdrop-blur-lg shadow-dialog transition-[transform,opacity] flex duration-300"
            style={{
              transform: transitionVisible
                ? 'translateX(0)'
                : 'translateX(-100%)',
              opacity: transitionVisible ? 1 : 0,
              display: display ? undefined : 'none',
            }}
          >
            <div
              className="shrink-0 overflow-y-auto bg-plain-100/75 dark:bg-plain-900/25 border-r dark:border-transparent"
              style={{ paddingLeft: 'env(safe-area-inset-left)' }}
            >
              <ProjectsBar onButtonClick={onClose} />
            </div>

            <div className="p-3 pl-5 overflow-y-auto flex items-start gap-2">
              <Sidebar onButtonClick={onClose} />

              <button
                type="button"
                className="btn btn-no-rounded rounded-full p-2 aspect-square sticky top-0"
                onClick={onClose}
                aria-label="Close"
              >
                <LargeCloseIcon size="1.25em" noAriaLabel />
              </button>
            </div>
          </ModalPanel>
        </div>
      </ModalRoot>
    );
  }
);
