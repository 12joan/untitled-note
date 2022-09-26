import React from 'react'

import { InlinePlaceholder } from '~/components/Placeholder'
import ItemIndex from '~/components/ItemIndex'

const FutureItemIndex = ({ futureItems, placeholders = 0, ifEmpty, ...otherProps }) => {
  const items = futureItems.orDefault(
    Array.from({ length: placeholders }, (_, i) => ({
      key: `placeholder-${i}`,
      as: 'div',
      label: <InlinePlaceholder />,
      preview: <InlinePlaceholder />,
      style: { pointerEvents: 'none' },
    }))
  )

  return (items.length > 0 || ifEmpty)
    ? <ItemIndex items={items} ifEmpty={ifEmpty} {...otherProps} />
    : null
}

export default FutureItemIndex
