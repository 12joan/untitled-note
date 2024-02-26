import { cssAdd } from '~/lib/cssAdd';

describe('cssAdd', () => {
  describe('with 1 argument', () => {
    it('returns the argument', () => {
      expect(cssAdd('1em')).toBe('1em');
    });

    it('converts numbers to pixels', () => {
      expect(cssAdd(1)).toBe('1px');
    });
  });

  describe('with multiple arguments', () => {
    it('adds them together', () => {
      expect(cssAdd('1em', '2em', '3em')).toBe('calc(1em + 2em + 3em)');
    });

    it('converts numbers to pixels', () => {
      expect(cssAdd('1em', 2, 3)).toBe('calc(1em + 2px + 3px)');
    });
  });
});
