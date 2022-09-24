import React, { useMemo } from 'react'

import { handleDragStartWithData } from '~/lib/dragData'

import CaretRightIcon from '~/components/icons/CaretRightIcon'
import { ContextMenuDropdown } from '~/components/Dropdown'

const ItemIndex = ({ viewWidth, title, ...otherProps }) => {
  const cardsPerRow = useMemo(() => {
    const remPixels = parseFloat(getComputedStyle(document.body).fontSize)
    const viewPadding = 2 * 5 / 4 * remPixels
    const cardWidth = 64 / 4 * remPixels
    const cardGap = 5 / 4 * remPixels
    return Math.max(1, Math.floor((viewWidth - viewPadding + cardGap) / (cardWidth + cardGap)))
  }, [viewWidth])

  const Component = cardsPerRow > 1 ? CardIndex : ListIndex

  return (
    <Component
      cardsPerRow={cardsPerRow}
      title={title && (
        <h2 className="text-2xl font-medium select-none" children={title} />
      )}
      {...otherProps}
    />
  )
}

const CardIndex = ({ title, items, showAllLink: ShowAllLink, cardsPerRow }) => {
  const cappedItems = ShowAllLink ? items.slice(0, cardsPerRow) : items

  const titleComponent = title && (ShowAllLink
    ? (
      <ShowAllLink className="btn btn-link-subtle flex items-center gap-0 hocus:gap-3 group transition-[gap]">
        {title}

        <div className="flex items-center gap-1 translate-y-0.5">
          <span className="whitespace-nowrap overflow-hidden w-0 group-hocus:w-full transition-[width] font-medium">Show all</span>
          <CaretRightIcon noAriaLabel />
        </div>
      </ShowAllLink>
    )
    : title
  )

  return (
    <section className="space-y-3">
      {titleComponent}

      <div className="flex flex-wrap gap-5">
        {cappedItems.map(item => (
          <CardItem key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

const ListIndex = ({ title, items, showAllLink: ShowAllLink }) => {
  const cappedItems = ShowAllLink ? items.slice(0, 5) : items

  const titleComponent = title && (ShowAllLink
    ? (
      <div className="flex justify-between items-center gap-3">
        {title}
        <ShowAllLink className="btn btn-link">Show all</ShowAllLink>
      </div>
    )
    : title
  )

  return (
    <section className="space-y-3">
      {titleComponent}

      <div className="rounded-lg border dark:border-transparent divide-y">
        {cappedItems.map(item => (
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
