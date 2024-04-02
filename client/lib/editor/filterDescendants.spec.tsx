/* @jsx jsx */
import { ELEMENT_H1, TNode } from '@udecode/plate';
import { jsx } from '@udecode/plate-test-utils';
import { filterDescendants } from './filterDescendants';

// eslint-disable-next-line no-unused-expressions
jsx;

describe('filterDescendants', () => {
  const inputDescendants = [
    <hh1>a</hh1>,
    <hh2>b</hh2>,
    <hh1>c</hh1>,
    <hh2>d</hh2>,
    <hh3>
      <hh1>e</hh1>
      <hh2>f</hh2>
    </hh3>,
  ] as any;

  const expectedDescendants = [
    <hh2>b</hh2>,
    <hh2>d</hh2>,
    <hh3>
      <hh2>f</hh2>
    </hh3>,
  ] as any;

  const condition = (node: TNode) => node.type !== ELEMENT_H1;

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
