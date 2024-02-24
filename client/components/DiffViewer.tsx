import React, {
  Dispatch,
  ElementType,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
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
import { EditorBody, EditorBodyProps } from './EditorBody';
import { useObjectVersion } from './useObjectVersion';

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

  const diffValue = useMemo(() => {
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

  const key = useObjectVersion(diffValue);

  return (
    <ChunkedEditorBody
      key={key}
      chunks={diffChunks}
      plugins={plugins}
      className={className}
    />
  );
};

interface ChunkCollapsedProps {
  chunkIndex: number;
  blockCount: number;
  showExpandButton: boolean;
}

interface ChunkPlugin {
  setExpandedChunks: Dispatch<SetStateAction<number[]>>;
}

const createChunkPlugin = createPluginFactory<ChunkPlugin>({
  key: 'chunk',
  // TODO
  // withOverrides: withGetFragmentExcludeChunk,
  then: (_editor, { options: { setExpandedChunks } }) => ({
    inject: {
      aboveComponent:
        () =>
        ({ children, element }) => {
          if (!element.chunkCollapsed) return children;
          const { chunkIndex, blockCount, showExpandButton } =
            element.chunkCollapsed as ChunkCollapsedProps;

          const mappedChildren = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                nodeProps: {
                  className: 'hidden',
                },
              } as any);
            }
            return child;
          });

          return (
            <>
              {showExpandButton && (
                <ExpandChunkButton
                  blockCount={blockCount}
                  onClick={() =>
                    setExpandedChunks((prev) => [...prev, chunkIndex])
                  }
                />
              )}
              {mappedChildren}
            </>
          );
        },
    },
  }),
});

interface ChunkedEditorBodyProps extends Omit<EditorBodyProps, 'initialValue'> {
  chunks: ElementChunk[];
}

const ChunkedEditorBody = ({
  chunks,
  plugins: basePlugins,
  ...props
}: ChunkedEditorBodyProps) => {
  const [expandedChunks, setExpandedChunks] = useState<number[]>([]);

  const plugins = useMemo(
    () => [
      ...basePlugins,
      createChunkPlugin({
        options: { setExpandedChunks },
      }),
    ],
    [basePlugins]
  );

  const value = useMemo(
    () =>
      chunks.flatMap(({ blocks, hasDiff }, chunkIndex) =>
        hasDiff || expandedChunks.includes(chunkIndex)
          ? blocks
          : blocks.map((block, blockIndex) => ({
              ...block,
              chunkCollapsed: {
                chunkIndex,
                blockCount: blocks.length,
                showExpandButton: blockIndex === 0,
              } satisfies ChunkCollapsedProps,
            }))
      ),
    [chunks, expandedChunks]
  );

  const key = useObjectVersion(value);

  return (
    <EditorBody
      key={key}
      plugins={plugins}
      initialValue={value}
      isReadOnly
      showFormattingToolbar={false}
      {...props}
    />
  );
};

interface ExpandChunkButtonProps {
  blockCount: number;
  onClick: () => void;
}

const ExpandChunkButton = ({ blockCount, onClick }: ExpandChunkButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-rect btn-secondary w-full flex justify-center gap-2 items-center font-sans"
      onClick={onClick}
    >
      <ExpandIcon noAriaLabel />
      Show {pluralize(blockCount, 'unchanged block')}
    </button>
  );
};
