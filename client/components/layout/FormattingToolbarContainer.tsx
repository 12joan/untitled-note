import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '~/lib/appContext';
import { groupedClassNames } from '~/lib/groupedClassNames';
import LargeCloseIcon from '../icons/LargeCloseIcon';

export interface FormattingToolbarContainerProps {
  children: ReactNode;
}

export const FormattingToolbarContainer = ({
  children,
}: FormattingToolbarContainerProps) => {
  const containerEl = useAppContext('formattingToolbarContainer');
  const ref = useAppContext('formattingToolbarRef');
  const displayMode = useAppContext('formattingToolbarDisplay');
  const close = useAppContext('toggleFormattingToolbar');
  const topBarHeight = useAppContext('topBarHeight');
  const isOffcanvas = displayMode !== 'static';

  return (
    containerEl &&
    createPortal(
      <div
        className={groupedClassNames({
          base: 'flex flex-col pb-5',
          variant: isOffcanvas
            ? 'fixed z-10 right-0 bottom-0'
            : 'pr-5 pl-1 pt-1 overflow-y-auto',
          hidden: displayMode === 'hidden' && 'hidden',
        })}
        style={{
          top: isOffcanvas ? topBarHeight : undefined,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <aside
          ref={ref}
          className={groupedClassNames({
            base: 'pointer-events-auto my-auto space-y-2',
            offcanvas:
              isOffcanvas &&
              'bg-plain-100/75 dark:bg-plain-700/75 backdrop-blur-lg p-1 rounded-l-lg shadow-dialog overflow-y-auto',
          })}
          tabIndex={0}
          aria-label="Formatting toolbar"
          onMouseDown={(event) => event.preventDefault()}
        >
          {isOffcanvas && (
            <button
              type="button"
              className="block btn p-3 aspect-square text-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={close}
              aria-label="Close"
            >
              <LargeCloseIcon size="1.25em" noAriaLabel />
            </button>
          )}

          {children}
        </aside>
      </div>,
      containerEl
    )
  );
};
