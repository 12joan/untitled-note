import React, { ComponentType } from 'react'

import { pluralize } from '~/lib/pluralize'
import { TagLink } from '~/lib/routes'
import { Tag } from '~/lib/types'

import { TagMenu } from '~/components/TagMenu'
import { ItemIndex, ItemIndexProps, Item } from '~/components/ItemIndex'

export interface TagIndexProps extends Omit<ItemIndexProps, 'items' | 'cardPreviewHeight'> {
  tags: Tag[]
  linkComponent?: ComponentType<any>
}

export const TagIndex = ({
  tags,
  ...otherProps
}: TagIndexProps) => {
  const itemForTag = (tag: Tag): Item => ({
    key: tag.id,
    label: tag.text,
    preview: pluralize(tag.documents_count, 'document'),
    as: TagLink,
    buttonProps: {
      tagId: tag.id,
    },
    contextMenu: (
      <TagMenu tag={tag} />
    ),
  })

  return (
    <ItemIndex
      items={tags.map(itemForTag)}
      {...otherProps}
    />
  )
}
