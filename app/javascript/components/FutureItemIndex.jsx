import React from 'react'

import ItemIndex from '~/components/ItemIndex'

const FutureItemIndex = ({ futureItems, ...otherProps }) => {
  const items = futureItems.orDefault([])

  return items.length > 0 && (
    <ItemIndex items={items} {...otherProps} />
  )
}

export default FutureItemIndex
