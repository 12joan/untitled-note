import { TNode } from '~/lib/editor/plate';
import { filterDescendants } from './filterDescendants';

describe('filterDescendants', () => {
  const inputDescendants = [
    { type: 'a', children: [{ text: '1' }] },
    { type: 'b', children: [{ text: '2' }] },
    { type: 'a', children: [{ text: '3' }] },
    { type: 'b', children: [{ text: '4' }] },
    {
      type: 'c',
      children: [
        { type: 'a', children: [{ text: '5' }] },
        { type: 'b', children: [{ text: '6' }] },
      ],
    },
  ];

  const expectedDescendants = [
    { type: 'b', children: [{ text: '2' }] },
    { type: 'b', children: [{ text: '4' }] },
    { type: 'c', children: [{ type: 'b', children: [{ text: '6' }] }] },
  ];

  const condition = (node: TNode) => node.type !== 'a';

  it('should filter a list of descendants', () => {
    const result = filterDescendants(inputDescendants, condition);
    expect(result).toEqual(expectedDescendants);
  });

  it('should filter an element', () => {
    const element = { type: 'p', children: inputDescendants };
    const result = filterDescendants(element, condition);
    expect(result).toEqual({ type: 'p', children: expectedDescendants });
  });
});
