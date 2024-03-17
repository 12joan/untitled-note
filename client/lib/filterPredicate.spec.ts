import { filterPredicate } from '~/lib/filterPredicate';

describe('filterPredicate', () => {
  describe('single word', () => {
    it('matches simple prefix', () => {
      expect(filterPredicate('hello', 'he')).toBe(true);
    });

    it('does not match non-prefix', () => {
      expect(filterPredicate('hello', 'lo')).toBe(false);
    });

    it('is case-insensitive', () => {
      expect(filterPredicate('hello', 'HE')).toBe(true);
    });

    it('is diacritic-insensitive', () => {
      expect(filterPredicate('hello', 'hé')).toBe(true);
    });
  });

  describe('multiple words', () => {
    it('matches when all words in query match', () => {
      expect(filterPredicate('hello world', 'world hello')).toBe(true);
      expect(filterPredicate('hello world', 'world')).toBe(true);
    });

    it('does not match when not all words in query match', () => {
      expect(filterPredicate('hello world', 'hello other')).toBe(false);
    });

    it('allows prefix for last word', () => {
      expect(filterPredicate('hello world', 'world he')).toBe(true);
    });

    it('does not allow prefix for non-last word', () => {
      expect(filterPredicate('hello world', 'wor hello')).toBe(false);
    });
  });
});
