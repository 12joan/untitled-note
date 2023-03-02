import React from 'react'

import pluralize from '~/lib/pluralize'
import { TagLink } from '~/lib/routes'

import TagMenu from '~/components/TagMenu'
import ItemIndex from '~/components/ItemIndex'

const TagIndex = ({ tags, ...otherProps }) => {
  const itemForTag = tag => ({
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

export default TagIndex
