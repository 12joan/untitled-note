import React, {
  createContext,
  HTMLAttributes,
  KeyboardEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { isHotkey } from '~/lib/editor/plate';
import { positiveMod } from '~/lib/positiveMod';

interface RadioCardGroupContext<T> {
  value: T;
  onValueChange: (value: T) => void;
  moveSelection: (direction: 'up' | 'down') => void;
}

const RadioCardGroupContext = createContext<RadioCardGroupContext<any> | null>(
  null
);

export interface RadioCardGroupProps<T> extends HTMLAttributes<HTMLDivElement> {
  value: T;
  onValueChange: (value: T) => void;
}

export const RadioCardGroup = <T,>({
  value,
  onValueChange,
  className,
  ...props
}: RadioCardGroupProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const moveSelection = useCallback((direction: 'up' | 'down') => {
    const container = containerRef.current;
    if (!container) return;

    const radioCards = Array.from(container.querySelectorAll('[role="radio"]'));
    const currentIndex = radioCards.findIndex((card) =>
      card.matches('[aria-checked="true"]')
    );
    if (currentIndex === -1) return;

    const nextIndex = positiveMod(
      currentIndex + (direction === 'up' ? -1 : 1),
      radioCards.length
    );
    const nextCard = radioCards[nextIndex] as HTMLElement;
    nextCard.click();
    nextCard.focus();
  }, []);

  const contextValue = useMemo(
    () => ({ value, onValueChange, moveSelection }),
    [value, onValueChange, moveSelection]
  );

  return (
    <RadioCardGroupContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        role="radiogroup"
        className={twMerge(
          'grid gap-2 rounded-lg stretch-focus-visible:focus-ring ring-offset-4',
          className
        )}
        {...props}
      />
    </RadioCardGroupContext.Provider>
  );
};

export interface RadioCardProps<T> extends HTMLAttributes<HTMLDivElement> {
  value: T;
  after?: (props: { checked: boolean }) => React.ReactNode;
}

export const RadioCard = <T,>({
  value,
  className,
  children,
  after,
  ...props
}: RadioCardProps<T>) => {
  const context = useContext(
    RadioCardGroupContext
  ) as RadioCardGroupContext<T> | null;

  if (!context) {
    throw new Error('RadioCard must be used within a RadioCardGroup');
  }

  const { value: currentValue, onValueChange, moveSelection } = context;
  const checked = value === currentValue;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const isUpOrLeft = isHotkey('up', event) || isHotkey('left', event);
    const isDownOrRight = isHotkey('down', event) || isHotkey('right', event);

    if (isUpOrLeft || isDownOrRight) {
      moveSelection(isUpOrLeft ? 'up' : 'down');
      event.preventDefault();
    }
  };

  return (
    <div
      className={twMerge(
        'relative stretch-hover:btn-hover border rounded-lg flex items-center data-active:focus-ring data-active:border-transparent after:rounded-lg',
        className
      )}
      data-active={checked}
      {...props}
    >
      <button
        type="button"
        role="radio"
        className="stretch-target no-focus-ring grow flex items-center gap-2 p-3 pr-0 last:pr-3 text-left"
        aria-checked={checked}
        tabIndex={checked ? 0 : -1}
        onClick={() => onValueChange(value)}
        onKeyDown={handleKeyDown}
      >
        <div className="size-5 border rounded-full data-active:bg-primary-500 data-active:dark:bg-primary-400 data-active:border-0 data-active:bg-tick bg-[length:90%] bg-center bg-no-repeat shrink-0" />

        {children}
      </button>

      {after && <div className="shrink-0 m-2">{after({ checked })}</div>}
    </div>
  );
};
