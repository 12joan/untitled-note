import { ElementType } from 'react';
import { DiffOperation } from '@udecode/plate';

export const diffTypeClassNames: Record<DiffOperation['type'], string> = {
  insert:
    'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 underline decoration-2',
  delete:
    'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 line-through decoration-2',
  update:
    'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
};

export const inlineDiffComponents: Record<DiffOperation['type'], ElementType> =
  {
    insert: 'ins',
    delete: 'del',
    update: 'span',
  };
