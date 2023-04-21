import React, { useMemo, ComponentType, ReactNode, MouseEvent } from 'react'

import { DragData, handleDragStartWithData } from '~/lib/dragData'

import { PopOutLink } from '~/components/PopOutLink'
import { ContextMenuDropdown } from '~/components/Dropdown'

export type Item = {
  key: any;
  as: ComponentType<any>;
  label: string;
  preview: string;
  buttonProps: Record<string, any>;
  contextMenu?: ReactNode;
  dragData?: DragData;
};

export interface ItemIndexProps extends Omit<IndexProps, 'items'> {
  items: Item[];
  viewWidth: number;
  title?: string
  showAllLink?: ComponentType<any>;
  ifEmpty?: ReactNode;
  render?: (children: JSX.Element) => JSX.Element;
}

export const ItemIndex = ({
  items,
  viewWidth,
  title,
  showAllLink,
  ifEmpty,
  render = x => x,
  ...otherProps
}: ItemIndexProps) => {
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
      <h2 className="h2 select-none" children={title} />
    )

    return showAllLink
      ? (
        <PopOutLink
          as={showAllLink}
          asProps={{ to: {} }}
          label="Show all"
          children={heading}
        />
      )
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

interface IndexProps {
  items: Item[];
  cardPreviewHeight?: string | number;
}

const CardIndex = ({ items, cardPreviewHeight }: IndexProps) => {
  return (
    <div className="flex flex-wrap gap-5">
      {items.map(item => (
        <CardItem key={item.key} item={item} cardPreviewHeight={cardPreviewHeight} />
      ))}
    </div>
  )
}

const ListIndex = ({ items }: IndexProps) => {
  return (
    <div className="rounded-lg border dark:border-transparent divide-y">
      {items.map(item => (
        <ListItem key={item.key} item={item} />
      ))}
    </div>
  )
}

interface ItemProps extends Record<string, any> {
  item: Item;
  cardPreviewHeight?: string | number;
}

const CardItem = ({ item, cardPreviewHeight, ...otherProps }: ItemProps) => {
  return (
    <Item
      item={item}
      className="shrink-0 btn w-64 space-y-1 p-5 border bg-white dark:bg-slate-800 dark:border-transparent"
      {...otherProps}
    >
      <strong className="block text-lg font-medium" children={item.label} />

      <p className="text-sm line-clamp-2 text-slate-500 dark:text-slate-400" style={{ height: cardPreviewHeight }}>
        {item.preview}
      </p>
    </Item>
  )
}

const ListItem = ({ item, ...otherProps }: ItemProps) => {
  return (
    <Item
      item={item}
      className="btn btn-no-rounded w-full p-3 space-y-1 cursor-pointer group-first:rounded-t-lg group-last:rounded-b-lg bg-white dark:bg-slate-800"
      {...otherProps}
    >
      {item.label}

      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
        {item.preview}
      </p>
    </Item>
  )
}

const Item = ({
  item: {
    as: ItemComponent,
    buttonProps,
    contextMenu,
    dragData,
    ...restItem
  },
  children,
  ...otherProps
}: ItemProps) => {
  const itemComponent = (
    <ItemComponent
      {...buttonProps}
      {...restItem}
      {...otherProps}
      children={children}
      onContextMenu={contextMenu && ((event: MouseEvent) => {
        event.preventDefault()
      })}
      onDragStart={dragData && handleDragStartWithData(dragData)}
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
