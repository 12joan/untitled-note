import { ChunkDiffOptions, chunkDiffs } from './chunkDiffs';

describe('chunkDiffs', () => {
  const options: ChunkDiffOptions<number> = {
    hasDiff: (block) => block % 2 === 0,
    paddingBlocks: 2,
  };

  it('works for empty array', () => {
    expect(chunkDiffs([], options)).toEqual([]);
  });

  it('works for single non-diff block', () => {
    expect(chunkDiffs([1], options)).toEqual([{ hasDiff: false, blocks: [1] }]);
  });

  it('works for multiple non-diff blocks', () => {
    expect(chunkDiffs([1, 3, 5, 7], options)).toEqual([
      { hasDiff: false, blocks: [1, 3, 5, 7] },
    ]);
  });

  it('works for single diff block', () => {
    expect(chunkDiffs([2], options)).toEqual([{ hasDiff: true, blocks: [2] }]);
  });

  it('works for multiple diff blocks', () => {
    expect(chunkDiffs([2, 4, 6, 8], options)).toEqual([
      { hasDiff: true, blocks: [2, 4, 6, 8] },
    ]);
  });

  it('works for single diff block surrounded by non-diff blocks', () => {
    expect(chunkDiffs([1, 3, 5, 7, 2, 9, 11, 13, 15], options)).toEqual([
      { hasDiff: false, blocks: [1, 3] },
      { hasDiff: true, blocks: [5, 7, 2, 9, 11] },
      { hasDiff: false, blocks: [13, 15] },
    ]);
  });

  it('works for multiple diff blocks with paddingBlocks * 2 non-diff blocks in between', () => {
    expect(
      chunkDiffs([1, 3, 5, 7, 2, 9, 11, 13, 15, 4, 17, 19, 21, 23], options)
    ).toEqual([
      { hasDiff: false, blocks: [1, 3] },
      { hasDiff: true, blocks: [5, 7, 2, 9, 11, 13, 15, 4, 17, 19] },
      { hasDiff: false, blocks: [21, 23] },
    ]);
  });

  it('works for multiple diff blocks with (paddingBlocks * 2) + 1 non-diff blocks in between', () => {
    expect(
      chunkDiffs([1, 3, 5, 7, 2, 9, 11, 13, 15, 17, 4, 19, 21, 23, 25], options)
    ).toEqual([
      { hasDiff: false, blocks: [1, 3] },
      { hasDiff: true, blocks: [5, 7, 2, 9, 11] },
      { hasDiff: false, blocks: [13] },
      { hasDiff: true, blocks: [15, 17, 4, 19, 21] },
      { hasDiff: false, blocks: [23, 25] },
    ]);
  });
});
