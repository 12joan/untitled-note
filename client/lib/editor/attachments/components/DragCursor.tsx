import React, { useMemo } from 'react';
import { cssAdd } from '~/lib/cssAdd';
import { useGlobalStore } from '~/lib/globalStore';

export const DragCursor = () => {
  const position = useGlobalStore('dragCursorPosition');

  const { left, right, top } = useMemo(() => {
    if (position === null) {
      return {};
    }

    const children = Array.from(
      document.querySelectorAll('[data-slate-editor] > *')
    );
    const isBelowLast = position >= children.length;

    const child = isBelowLast
      ? children[children.length - 1]
      : children[position];

    if (!child) {
      return {};
    }

    const { left, right, top, bottom } = child.getBoundingClientRect();

    return {
      left,
      right: window.innerWidth - right,
      top: isBelowLast ? cssAdd(bottom, '0.375rem') : cssAdd(top, '-0.375rem'),
    };
  }, [position]);

  if (position === null) {
    return null;
  }

  return (
    <div
      className="h-1 rounded-full bg-primary-500 dark:bg-primary-400 fixed pointer-events-none -translate-y-1/2"
      style={{
        left,
        right,
        top,
      }}
    />
  );
};
