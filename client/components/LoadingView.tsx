import React, { CSSProperties, useState } from 'react';
import { useAppContext } from '~/lib/appContext';
import { useTimeout } from '~/lib/useTimer';

export interface LoadingViewProps extends Record<string, any> {
  style?: CSSProperties;
  showImmediately?: boolean;
}

export const LoadingView = ({
  style = {},
  showImmediately = false,
  ...otherProps
}: LoadingViewProps) => {
  const topBarHeight = useAppContext('topBarHeight');
  const [showLoading, setShowLoading] = useState(showImmediately);

  useTimeout(() => !showImmediately && setShowLoading(true), 500);

  return (
    <div
      className="m-auto transition-opacity"
      style={{
        paddingBottom: topBarHeight,
        opacity: showLoading ? 1 : 0,
        ...style,
      }}
      {...otherProps}
    >
      {showLoading && (
        <div className="flex gap-2" aria-live="polite" aria-label="Loading">
          {[0, 333, 667].map((delay) => (
            <div
              key={delay}
              className="w-4 h-4 bg-plain-300 dark:bg-plain-700 rounded-full animate-grow"
              style={{
                animationDelay: `${delay}ms`,
                animationDuration: '1000ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
