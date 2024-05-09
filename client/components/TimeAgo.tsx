import React, { useCallback, useEffect } from 'react';
import { timeAgo, TimeAgoOptions } from '~/lib/timeAgo';

export const TimeAgo = (options: TimeAgoOptions) => {
  const { date } = options;
  const ref = React.useRef<HTMLTimeElement>(null);

  const getDateTime = useCallback(() => date.toISOString(), [date]);
  const getTooltip = useCallback(() => date.toLocaleString(), [date]);
  const getTimeAgo = useCallback(() => timeAgo(options), [options]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNextTick = () => {
      const timeToNextSecond = 1000 - (Date.now() % 1000);
      timeout = setTimeout(() => {
        if (ref.current) {
          ref.current.dateTime = getDateTime();
          ref.current.title = getTooltip();
          ref.current.textContent = getTimeAgo();
        }
        scheduleNextTick();
      }, timeToNextSecond);
    };

    scheduleNextTick();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [getDateTime, getTooltip, getTimeAgo]);

  return (
    <time ref={ref} dateTime={getDateTime()} title={getTooltip()}>
      {getTimeAgo()}
    </time>
  );
};
