import { pluralize } from '~/lib/pluralize';

export type TimeAgoFormat = 'long' | 'short';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface TimeAgoOptions {
  date: Date;
  referenceDate?: Date;
  locale?: string;
  format?: TimeAgoFormat;
}

export const timeAgo = ({
  date,
  referenceDate = new Date(),
  locale = undefined,
  format = 'long',
}: TimeAgoOptions): string => {
  const isFuture = date > referenceDate;
  if (isFuture) {
    return 'in the future';
  }

  const unitsAgo = (unit: string, count: number) => {
    if (format === 'long') {
      return `${pluralize(count, unit)} ago`;
    }

    const unitLetter = unit[0];
    return `${count}${unitLetter} ago`;
  };

  const secondsAgo = Math.floor(
    (referenceDate.getTime() - date.getTime()) / 1000
  );

  if (secondsAgo >= DAY) {
    return date.toLocaleDateString(
      locale,
      format === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : undefined
    );
  }

  if (secondsAgo >= HOUR) {
    return unitsAgo('hour', Math.floor(secondsAgo / HOUR));
  }

  if (secondsAgo >= MINUTE) {
    return unitsAgo('minute', Math.floor(secondsAgo / MINUTE));
  }

  if (secondsAgo >= 5) {
    return unitsAgo('second', secondsAgo);
  }

  return 'just now';
};
