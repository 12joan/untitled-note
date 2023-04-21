import React from 'react';

export interface MeterProps extends Record<string, any> {
  max: number;
  value: number;
  className?: string;
}

export const Meter = ({
  max,
  value,
  className = '',
  ...otherProps
}: MeterProps) => {
  return (
    <div
      className={`w-full rounded-full bg-slate-900/10 dark:bg-slate-50/10 relative overflow-hidden ${className}`}
      {...otherProps}
    >
      <div
        className="bg-primary-500 dark:bg-primary-400 h-2"
        style={{
          width: `${(value / max) * 100}%`,
        }}
      />
    </div>
  );
};
