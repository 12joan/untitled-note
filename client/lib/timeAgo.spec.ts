import { timeAgo, TimeAgoFormat } from '~/lib/timeAgo';

const formats: TimeAgoFormat[] = ['long', 'short'];

const bothFormats = (fn: (format: TimeAgoFormat) => void) => {
  formats.forEach((format) => {
    describe(`when format is ${format}`, () => {
      fn(format);
    });
  });
};

describe('timeAgo', () => {
  const referenceDate = new Date('2020-06-15T12:30:30Z');

  describe('when the date is in the future', () => {
    const date = new Date('2020-06-15T12:30:31Z');

    bothFormats((format) => {
      it('returns "in the future"', () => {
        expect(timeAgo({ date, referenceDate, format })).toBe('in the future');
      });
    });
  });

  describe('when the date is less than 5 seconds ago', () => {
    const date = new Date('2020-06-15T12:30:26Z');

    bothFormats((format) => {
      it('returns "just now"', () => {
        expect(timeAgo({ date, referenceDate, format })).toBe('just now');
      });
    });
  });

  describe('when the date is less than 1 minute ago', () => {
    const date = new Date('2020-06-15T12:30:01Z');

    describe('when format is long', () => {
      it('returns "N seconds ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'long' })).toBe(
          '29 seconds ago'
        );
      });
    });

    describe('when format is short', () => {
      it('returns "Ns ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'short' })).toBe(
          '29s ago'
        );
      });
    });
  });

  describe('when the date is exactly 1 minute ago', () => {
    const date = new Date('2020-06-15T12:29:30Z');

    describe('when format is long', () => {
      it('returns "1 minute ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'long' })).toBe(
          '1 minute ago'
        );
      });
    });
  });

  describe('when the date is less than 1 hour ago', () => {
    const date = new Date('2020-06-15T12:03:30Z');

    describe('when format is long', () => {
      it('returns "N minutes ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'long' })).toBe(
          '27 minutes ago'
        );
      });
    });

    describe('when format is short', () => {
      it('returns "Nm ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'short' })).toBe(
          '27m ago'
        );
      });
    });
  });

  describe('when the date is exactly 1 hour ago', () => {
    const date = new Date('2020-06-15T11:30:30Z');

    describe('when format is long', () => {
      it('returns "1 hour ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'long' })).toBe(
          '1 hour ago'
        );
      });
    });
  });

  describe('when the date is less than 1 day ago', () => {
    const date = new Date('2020-06-15T01:30:30Z');

    describe('when format is long', () => {
      it('returns "N hours ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'long' })).toBe(
          '11 hours ago'
        );
      });
    });

    describe('when format is short', () => {
      it('returns "Nh ago"', () => {
        expect(timeAgo({ date, referenceDate, format: 'short' })).toBe(
          '11h ago'
        );
      });
    });
  });

  describe('when the date is before 1 day ago', () => {
    const date = new Date('2020-06-14T12:30:30Z');

    describe('when format is long', () => {
      it('returns date in long format', () => {
        expect(
          timeAgo({ date, referenceDate, format: 'long', locale: 'en-us' })
        ).toBe('June 14, 2020');
      });
    });

    describe('when format is short', () => {
      it('returns date in short format', () => {
        expect(
          timeAgo({ date, referenceDate, format: 'short', locale: 'en-us' })
        ).toBe('6/14/2020');
      });
    });
  });
});
