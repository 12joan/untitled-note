import React, { useMemo } from 'react'

import { handleDragStartWithData } from '~/lib/dragData'

import PopOutLink from '~/components/PopOutLink'
import { ContextMenuDropdown } from '~/components/Dropdown'

const ItemIndex = ({ items, viewWidth, title, showAllLink, ifEmpty, render = x => x, ...otherProps }) => {
  const cardsPerRow = useMemo(() => {
    const remPixels = parseFloat(getComputedStyle(document.body).fontSize)
    const viewPadding = 2 * 5 / 4 * remPixels
    const cardWidth = 64 / 4 * remPixels
    const cardGap = 5 / 4 * remPixels
    return Math.max(1, Math.floor((viewWidth - viewPadding + cardGap) / (cardWidth + cardGap)))
  }, [viewWidth])

  if (items.length === 0 && !ifEmpty) {
    return null
  }

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

  return render(
    <section className="space-y-3">
      {titleComponent}

      {(items.length === 0 && ifEmpty)
        ? ifEmpty
        : <Component items={showAllLink ? items.slice(0, limit) : items} {...otherProps} />
      }
    </section>
  )
}

const CardIndex = ({ items, cardPreviewHeight }) => {
  return (
    <div className="flex flex-wrap gap-5">
      {items.map(item => (
        <CardItem key={item.key} item={item} cardPreviewHeight={cardPreviewHeight} />
      ))}
    </div>
  )
}

const ListIndex = ({ items, cardPreviewHeight }) => {
  return (
    <div className="rounded-lg border dark:border-transparent divide-y">
      {items.map(item => (
        <ListItem key={item.key} item={item} />
      ))}
    </div>
  )
}

const CardItem = ({ item: { label, preview, ...itemProps }, cardPreviewHeight, ...otherProps }) => {
  return (
    <Item
      className="shrink-0 btn btn-solid w-64 space-y-1 p-5 border dark:border-transparent dark:bg-slate-800"
      {...itemProps}
      {...otherProps}
    >
      <strong className="block text-lg font-medium" children={label} />

      <p className="text-sm line-clamp-2 text-slate-500 dark:text-slate-400" style={{ height: cardPreviewHeight }}>
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
      {label}

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
      onContextMenu={contextMenu && (event => {
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
