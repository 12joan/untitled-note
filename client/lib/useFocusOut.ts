import { FocusEvent, useRef } from 'react';

export const useFocusOut = <T extends HTMLElement>(
  callback: (event: FocusEvent<T>) => void
) => {
  const ref = useRef<T>(null);

  const onBlur = (event: FocusEvent<T>) => {
    if (!ref.current?.contains(event.relatedTarget as Node)) {
      callback(event);
    }
  };

  return [ref, { onBlur }] as const;
};
