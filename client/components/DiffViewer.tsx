import React, { ElementType, useMemo } from 'react';
import {
  computeDiff,
  createPlateEditor,
  createPluginFactory,
  DiffOperation,
  Plate,
  PlateContent,
  PlateRenderLeafProps,
  Value,
} from '@udecode/plate';
import { usePlugins } from '~/lib/editor/plugins';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Tooltip } from '~/components/Tooltip';

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
            'rounded-lg relative before:absolute before:inset-y-0 before:-left-2 before:w-1 before:rounded-full',
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

export interface DiffViewerProps {
  previous: Value | null;
  current: Value;
}

export const DiffViewer = ({ previous, current }: DiffViewerProps) => {
  const basePlugins = usePlugins();

  const plugins = useMemo(
    () => [...basePlugins, createDiffPlugin()],
    [basePlugins]
  );

  const diffValue = useMemo(() => {
    if (!previous) return current;

    const tempEditor = createPlateEditor({
      plugins,
    });

    return computeDiff(previous, current, {
      isInline: tempEditor.isInline,
      lineBreakChar: '¶',
    }) as Value;
  }, [previous, current, plugins]);

  return (
    <Plate
      key={JSON.stringify(diffValue)}
      initialValue={diffValue}
      plugins={plugins}
      readOnly
    >
      <PlateContent
        className={groupedClassNames({
          sizing: 'grow max-w-none children:lg:narrow',
          spacing: 'em:space-y-3',
          textColor: 'text-black dark:text-white',
          focusRing: 'no-focus-ring',
          baseFontSize:
            'slate-void:em:text-lg slate-string:em:text-lg/[1.555em]',
        })}
      />
    </Plate>
  );
};
