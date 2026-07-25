import type { ComponentType } from 'react';
import {
  type Item,
  ItemIndex,
  type ItemIndexProps,
} from '~/components/ItemIndex';
import { TagMenu } from '~/components/TagMenu';
import { pluralize } from '~/lib/pluralize';
import { TagLink } from '~/lib/routes';
import type { Tag } from '~/lib/types';

export interface TagIndexProps
  extends Omit<ItemIndexProps, 'items' | 'cardPreviewHeight'> {
  tags: Tag[];
  linkComponent?: ComponentType<any>;
}

export const TagIndex = ({ tags, ...otherProps }: TagIndexProps) => {
  const itemForTag = (tag: Tag): Item => ({
    key: tag.id,
    label: tag.text,
    preview: pluralize(tag.documents_count, 'document'),
    as: TagLink,
    buttonProps: {
      to: {
        tagId: tag.id,
      },
    },
    contextMenu: <TagMenu tag={tag} />,
  });

  return <ItemIndex items={tags.map(itemForTag)} {...otherProps} />;
};
