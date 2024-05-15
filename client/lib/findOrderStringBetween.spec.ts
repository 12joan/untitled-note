import { findOrderStringBetween } from '~/lib/findOrderStringBetween';

describe('findOrderStringBetween', () => {
  it('should produce an order string before', () => {
    expect(findOrderStringBetween(null, '8')).toBe('4');
    expect(findOrderStringBetween(null, '4')).toBe('2');
    expect(findOrderStringBetween(null, '2')).toBe('1');
    expect(findOrderStringBetween(null, '1')).toBe('08');
    expect(findOrderStringBetween(null, '08')).toBe('04');
    expect(findOrderStringBetween(null, '04')).toBe('02');
    expect(findOrderStringBetween(null, '02')).toBe('01');
    expect(findOrderStringBetween(null, '01')).toBe('008');
    expect(findOrderStringBetween(null, '008')).toBe('004');
    expect(findOrderStringBetween(null, '004')).toBe('002');
    expect(findOrderStringBetween(null, '002')).toBe('001');
    expect(findOrderStringBetween(null, '001')).toBe('0008');
  });

  it('should produce an order string after', () => {
    expect(findOrderStringBetween('8', null)).toBe('c');
    expect(findOrderStringBetween('c', null)).toBe('e');
    expect(findOrderStringBetween('e', null)).toBe('f');
    expect(findOrderStringBetween('f', null)).toBe('f8');
    expect(findOrderStringBetween('f8', null)).toBe('fc');
    expect(findOrderStringBetween('fc', null)).toBe('fe');
    expect(findOrderStringBetween('fe', null)).toBe('ff');
    expect(findOrderStringBetween('ff', null)).toBe('ff8');
    expect(findOrderStringBetween('ff8', null)).toBe('ffc');
    expect(findOrderStringBetween('ffc', null)).toBe('ffe');
    expect(findOrderStringBetween('ffe', null)).toBe('fff');
    expect(findOrderStringBetween('fff', null)).toBe('fff8');
  });

  it('should produce an order string between', () => {
    expect(findOrderStringBetween('1', '8')).toBe('4');
    expect(findOrderStringBetween('1', '4')).toBe('2');
    expect(findOrderStringBetween('1', '2')).toBe('18');
    expect(findOrderStringBetween('1', '18')).toBe('14');
    expect(findOrderStringBetween('1', '14')).toBe('12');
    expect(findOrderStringBetween('1', '12')).toBe('11');
    expect(findOrderStringBetween('1', '11')).toBe('108');

    expect(findOrderStringBetween('8', 'f')).toBe('b');
    expect(findOrderStringBetween('b', 'f')).toBe('d');
    expect(findOrderStringBetween('d', 'f')).toBe('e');
    expect(findOrderStringBetween('e', 'f')).toBe('e8');
    expect(findOrderStringBetween('e8', 'f')).toBe('ec');
    expect(findOrderStringBetween('ec', 'f')).toBe('ee');
    expect(findOrderStringBetween('ee', 'f')).toBe('ef');
    expect(findOrderStringBetween('ef', 'f')).toBe('ef8');

    expect(findOrderStringBetween('e8', 'ec')).toBe('ea');
    expect(findOrderStringBetween('ea', 'ec')).toBe('eb');
    expect(findOrderStringBetween('ea', 'eb')).toBe('ea8');

    expect(findOrderStringBetween('1b42', '2b41')).toBe('2341');
  });

  it('should work for sorting large numbers of items', () => {
    const debug = false;
    const items: string[] = [];

    const insertAtPosition = (position: number) => {
      const before: string | null = items[position - 1] ?? null;
      const after: string | null = items[position] ?? null;

      const orderString = findOrderStringBetween(before, after);

      const rangeDescription = `[${before ?? 'null'}, ${after ?? 'null'}]`;

      if (debug) {
        console.log(`Inserting at position ${position} in range ${rangeDescription}: ${orderString}`);
      }

      expect(items).not.toContain(orderString);

      if (before) {
        expect(orderString > before).toBe(true);
      }

      if (after) {
        expect(orderString < after).toBe(true);
      }

      expect(orderString).not.toMatch(/0$/);

      items.splice(position, 0, orderString);
    };

    const removeAtPosition = (position: number) => {
      if (debug) {
        console.log(`Removing at position ${position}`);
      }

      items.splice(position, 1);
    };

    const startTime = performance.now();
    const endTime = startTime + 1000;

    while (performance.now() < endTime) {
      if (debug) {
        console.log(items);
      }

      if (Math.random() < 0.1 && items.length > 0) {
        const randomPosition = Math.floor(Math.random() * items.length);
        removeAtPosition(randomPosition);
      } else {
        const randomPosition = (() => {
          const x = Math.random();
          if (x < 0.1) return 0;
          if (x > 0.9) return items.length;
          return Math.floor(Math.random() * (items.length + 1));
        })();

        insertAtPosition(randomPosition);
      }
    }
  });
});
