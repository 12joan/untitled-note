import React, { useMemo } from 'react'

import { handleDragStartWithData } from '~/lib/dragData'

import PopOutLink from '~/components/PopOutLink'
import { ContextMenuDropdown } from '~/components/Dropdown'

const ItemIndex = ({ items, viewWidth, title, showAllLink, ...otherProps }) => {
  const cardsPerRow = useMemo(() => {
    const remPixels = parseFloat(getComputedStyle(document.body).fontSize)
    const viewPadding = 2 * 5 / 4 * remPixels
    const cardWidth = 64 / 4 * remPixels
    const cardGap = 5 / 4 * remPixels
    return Math.max(1, Math.floor((viewWidth - viewPadding + cardGap) / (cardWidth + cardGap)))
  }, [viewWidth])

  const { Component, limit } = cardsPerRow > 1
    ? { Component: CardIndex, limit: cardsPerRow }
    : { Component: ListIndex, limit: 5 }

  const titleComponent = title && (() => {
    const heading = (
      <h2 className="text-2xl font-medium select-none" children={title} />
    )

    return showAllLink
      ? <PopOutLink as={showAllLink} label="Show all" children={heading} />
      : heading
  })()

  return (
    <Component
      cardsPerRow={cardsPerRow}
      title={titleComponent}
      items={showAllLink ? items.slice(0, limit) : items}
      {...otherProps}
    />
  )
}

const CardIndex = ({ title, items, cardsPerRow }) => {
  return (
    <section className="space-y-3">
      {title}

      <div className="flex flex-wrap gap-5">
        {items.map(item => (
          <CardItem key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

const ListIndex = ({ title, items }) => {
  return (
    <section className="space-y-3">
      {title}

      <div className="rounded-lg border dark:border-transparent divide-y">
        {items.map(item => (
          <ListItem key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

const CardItem = ({ item: { label, preview, ...itemProps }, ...otherProps }) => {
  return (
    <Item
      className="shrink-0 btn btn-solid w-64 space-y-1 p-5 border dark:border-transparent overflow-wrap-break-word"
      {...itemProps}
      {...otherProps}
    >
      <strong className="block text-lg font-medium" children={label} />

      <p className="text-sm line-clamp-2 text-slate-500 dark:text-slate-400 h-[40px]">
        {preview}
      </p>
    </Item>
  )
}

const ListItem = ({ item: { label, preview, ...itemProps }, ...otherProps }) => {
  return (
    <Item
      className="w-full p-3 space-y-1 dark:bg-slate-800 hocus:bg-slate-100 dark:hocus:bg-slate-700 cursor-pointer group-first:rounded-t-lg group-last:rounded-b-lg"
      {...itemProps}
      {...otherProps}
    >
      <div className="overflow-wrap-break-word">
        {label}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
        {preview}
      </p>
    </Item>
  )
}

const Item = ({ as: ItemComponent, buttonProps, contextMenu, dragData, children, ...otherProps }) => {
  const itemComponent = (
    <ItemComponent
      {...buttonProps}
      {...otherProps}
      children={children}
      onContextMenu={contextMenu !== undefined && (event => {
        event.preventDefault()
      })}
      onDragStart={handleDragStartWithData(dragData)}
    />
  )

  return (
    <div className="group flex">
      {contextMenu === undefined
        ? itemComponent
        : (
          <ContextMenuDropdown items={contextMenu} children={itemComponent} />
        )
      }
    </div>
  )
}

export default ItemIndex
