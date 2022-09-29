import React from 'react'

import pluralize from '~/lib/pluralize'
import { TagLink } from '~/lib/routes'

import FutureItemIndex from '~/components/FutureItemIndex'

const FutureTagIndex = ({ futureTags, ...otherProps }) => {
  const itemForTag = tag => ({
    key: tag.id,
    label: tag.text,
    preview: pluralize(tag.documents_count, 'document'),
    as: TagLink,
    buttonProps: {
      tagId: tag.id,
    },
  })

  return (
    <FutureItemIndex
      futureItems={futureTags.map(xs => xs.map(itemForTag))}
      {...otherProps}
    />
  )
}

export default FutureTagIndex
