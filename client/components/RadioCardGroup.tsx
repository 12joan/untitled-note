import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export type RadioCardGroupProps = HTMLAttributes<HTMLDivElement>;

export const RadioCardGroup = ({
  className,
  ...props
}: RadioCardGroupProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        'grid gap-2 focus-visible-within:focus-ring ring-offset-4 rounded-lg',
        className
      )}
    />
  );
};

export interface RadioCardProps extends HTMLAttributes<HTMLLabelElement> {
  name: string;
  checked: boolean;
  onCheck: () => void;
}

export const RadioCard = ({
  name,
  checked,
  onCheck,
  className,
  children,
  ...props
}: RadioCardProps) => {
  return (
    <label
      className={twMerge(
        'btn border rounded-lg p-3 flex gap-2 items-center data-active:focus-ring data-active:border-transparent',
        className
      )}
      data-active={checked}
      {...props}
    >
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onCheck}
      />

      <div className="flex-shrink-0 w-5 h-5 border rounded-full data-active:bg-primary-500 data-active:dark:bg-primary-400 data-active:border-0 data-active:bg-tick bg-[length:90%] bg-center bg-no-repeat" />

      {children}
    </label>
  );
};
