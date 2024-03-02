import React, { useMemo, useState } from 'react';
import {
  computeDiff,
  createPlateEditor,
  getNodeString,
  PlatePlugin,
  Value,
} from '@udecode/plate';
import { usePlugins } from '~/lib/editor/plugins';
import { useLayoutEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import { useObjectVersion } from '~/lib/useObjectVersion';
import { EditorBody } from '~/components/EditorBody';
import { collapseBlocksWithoutDiff } from './chunks/collapseBlocksWithoutDiff';
import { createChunkPlugin } from './chunks/createChunkPlugin';
import { createDiffPlugin } from './diff/createDiffPlugins';
import { hasDiff } from './diff/hasDiff';
import { textsAreComparable } from './diff/textsAreComparable';

export interface DiffViewerProps {
  previous: Value | null;
  current: Value;
  showDiff?: boolean;
}

export const DiffViewer = ({
  previous,
  current,
  showDiff: showDiffProp = true,
}: DiffViewerProps) => {
  const showDiff = showDiffProp && previous;

  const basePlugins = usePlugins({
    enabledCategories: {
      behaviour: false,
    },
  });

  const diffPlugins: PlatePlugin[] = useMemo(
    () => [...basePlugins, createDiffPlugin()],
    [basePlugins]
  );

  const diffValue = useMemo(() => {
    if (!previous) return current;

    const tempEditor = createPlateEditor({
      plugins: diffPlugins,
    });

    return JSON.parse(
      JSON.stringify(
        computeDiff(previous, current, {
          elementsAreRelated: (element, nextElement) =>
            textsAreComparable(
              getNodeString(element),
              getNodeString(nextElement)
            ),
          isInline: tempEditor.isInline,
          lineBreakChar: '¶',
        })
      )
    ) as Value;
  }, [previous, current, diffPlugins]);

  const [expandedChunks, setExpandedChunks] = useState<number[]>([]);

  useLayoutEffectAfterFirst(() => {
    setExpandedChunks([]);
  }, [diffValue]);

  const collapsedDiffValue = useMemo(
    () =>
      collapseBlocksWithoutDiff(diffValue, {
        expandedChunks,
      }),
    [diffValue, expandedChunks]
  );

  const collapsedDiffPlugins: PlatePlugin<any>[] = useMemo(
    () => [
      ...diffPlugins,
      createChunkPlugin({
        options: {
          setExpandedChunks,
        },
      }),
    ],
    [diffPlugins]
  );

  const value = showDiff ? collapsedDiffValue : current;
  const key = useObjectVersion(value);

  const hasChangedBlocks = useMemo(() => diffValue.some(hasDiff), [diffValue]);
  const emptyDiff = showDiff && !hasChangedBlocks;

  if (emptyDiff) {
    return (
      <div className="bg-plain-100 dark:bg-plain-800 rounded-lg p-3 select-none text-center">
        No changes since the previous snapshot
      </div>
    );
  }

  return (
    <EditorBody
      key={key}
      initialValue={value}
      plugins={collapsedDiffPlugins}
      isReadOnly
      showFormattingToolbar={false}
    />
  );
};
