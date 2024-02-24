import React, { ElementType, useMemo, useRef, useState } from 'react';
import {
  computeDiff,
  createPlateEditor,
  createPluginFactory,
  DiffOperation,
  isElement,
  PlateRenderLeafProps,
  TDescendant,
  TElement,
  Value,
  withGetFragmentExcludeDiff,
} from '@udecode/plate';
import { Chunk, chunkDiffs } from '~/lib/chunkDiffs';
import { usePlugins } from '~/lib/editor/plugins';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { pluralize } from '~/lib/pluralize';
import { Tooltip } from '~/components/Tooltip';
import ExpandIcon from './icons/ExpandIcon';
import { EditorBody } from './EditorBody';

const diffTypeClassNames: Record<DiffOperation['type'], string> = {
  insert:
    'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 underline decoration-2',
  delete:
    'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 line-through decoration-2',
  update:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
};

const inlineDiffComponents: Record<DiffOperation['type'], ElementType> = {
  insert: 'ins',
  delete: 'del',
  update: 'span',
};

const DiffLeaf = ({
  children,
  nodeProps = {},
  attributes,
  leaf,
}: PlateRenderLeafProps) => {
  const diffOperation = leaf.diffOperation as DiffOperation;

  const Component = inlineDiffComponents[diffOperation.type];

  const className = groupedClassNames({
    diffType: diffTypeClassNames[diffOperation.type],
  });

  return (
    <Component {...attributes} {...nodeProps} className={className}>
      {children}
    </Component>
  );
};

const createDiffPlugin = createPluginFactory({
  key: 'diff',
  isLeaf: true,
  component: DiffLeaf,
  withOverrides: withGetFragmentExcludeDiff,
  inject: {
    aboveComponent:
      () =>
      ({ children, element, editor }) => {
        if (!element.diff) return children;
        const diffOperation = element.diffOperation as DiffOperation;

        const inline = editor.isInline(element);

        const Component = inline
          ? inlineDiffComponents[diffOperation.type]
          : 'div';

        const className = groupedClassNames({
          block:
            !inline &&
            'rounded-md relative before:absolute before:inset-y-0 before:-left-2 before:w-1 before:rounded-full',
          blockColor: {
            insert: 'before:bg-green-500',
            delete: 'before:bg-red-500',
            update: 'before:bg-yellow-500',
          }[diffOperation.type],
          diffType: diffTypeClassNames[diffOperation.type],
        });

        return (
          <Tooltip content={diffOperation.type}>
            <Component className={className}>{children}</Component>
          </Tooltip>
        );
      },
  },
});

const hasDiff = (descendant: TDescendant): boolean =>
  'diff' in descendant ||
  (isElement(descendant) && descendant.children.some(hasDiff));

type ElementChunk = Chunk<TElement>;

export interface DiffViewerProps {
  previous: Value | null;
  current: Value;
  className?: string;
}

export const DiffViewer = ({
  previous,
  current,
  className,
}: DiffViewerProps) => {
  const basePlugins = usePlugins({
    enabledCategories: {
      behaviour: false,
    },
  });

  const plugins = useMemo(
    () => [...basePlugins, createDiffPlugin()],
    [basePlugins]
  );

  const versionRef = useRef(0);

  const diffValue = useMemo(() => {
    versionRef.current++;

    if (!previous) return current;

    const tempEditor = createPlateEditor({
      plugins,
    });

    return JSON.parse(
      JSON.stringify(
        computeDiff(previous, current, {
          isInline: tempEditor.isInline,
          lineBreakChar: '¶',
        })
      )
    ) as Value;
  }, [previous, current, plugins]);

  const diffChunks: ElementChunk[] = useMemo(
    () =>
      chunkDiffs(diffValue, {
        hasDiff,
        paddingBlocks: 1,
      }),
    [diffValue]
  );

  return (
    <div className="space-y-3" key={versionRef.current}>
      {diffChunks.map((chunk, i) => (
        <DiffChunk key={i} chunk={chunk} />
      ))}
    </div>
  );

  // return (
  //   <EditorBody
  //     key={versionRef.current}
  //     initialValue={diffValue}
  //     plugins={plugins}
  //     isReadOnly
  //     showFormattingToolbar={false}
  //     className={className}
  //   />
  // );
};

interface DiffChunkProps {
  chunk: ElementChunk;
}

const DiffChunk = ({ chunk }: DiffChunkProps) => {
  return chunk.hasDiff ? (
    <Blocks blocks={chunk.blocks} />
  ) : (
    <CollapsibleBlocks blocks={chunk.blocks} />
  );
};

interface BlocksProps {
  blocks: TElement[];
}

const Blocks = ({ blocks }: BlocksProps) => {
  const basePlugins = usePlugins({
    enabledCategories: {
      behaviour: false,
    },
  });

  const plugins = useMemo(
    () => [...basePlugins, createDiffPlugin()],
    [basePlugins]
  );

  return (
    <EditorBody
      initialValue={blocks}
      plugins={plugins}
      isReadOnly
      showFormattingToolbar={false}
    />
  );
};

const CollapsibleBlocks = ({ blocks }: BlocksProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) return <Blocks blocks={blocks} />;

  return (
    <button
      type="button"
      className="btn btn-rect btn-secondary w-full flex justify-center gap-2 items-center"
      onClick={() => setIsOpen(true)}
    >
      <ExpandIcon noAriaLabel />
      Show {pluralize(blocks.length, 'unchanged block')}
    </button>
  );
};
