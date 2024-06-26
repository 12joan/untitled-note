import { DiffOperation, PlateRenderElementProps } from '@udecode/plate';
import { injectNodeProps } from '~/lib/editor/injectNodeProps';
import { groupedClassNames } from '~/lib/groupedClassNames';

export const DiffElement = ({ children, element }: PlateRenderElementProps) => {
  if (!element.diff) return children;
  const diffOperation = element.diffOperation as DiffOperation;

  return injectNodeProps(children, {
    className: groupedClassNames({
      base: 'diff-element',
      diffType: {
        insert: 'diff-insert',
        delete: 'diff-delete',
        update: 'diff-update',
      }[diffOperation.type],
    }),
    'aria-label': {
      insert: 'Inserted',
      delete: 'Deleted',
      update: 'Updated',
    }[diffOperation.type],
  });
};
