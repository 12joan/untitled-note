import React, { useRef } from 'react'

import { useContext } from '~/lib/context'
import { DocumentLink } from '~/lib/routes'
import useElementSize from '~/lib/useElementSize'

import { InlinePlaceholder } from '~/components/Placeholder'
import { ContextMenuDropdown } from '~/components/Dropdown'
import CaretRightIcon from '~/components/icons/CaretRightIcon'
import DocumentMenu from '~/components/DocumentMenu'

const OverviewView = () => {
  const { futureProject, futurePartialDocuments, futurePinnedDocuments } = useContext()

  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const remPixels = parseFloat(getComputedStyle(document.body).fontSize)
  const viewPadding = 2 * 5 / 4 * remPixels
  const cardWidth = 64 / 4 * remPixels
  const cardGap = 5 / 4 * remPixels
  const cardsPerRow = Math.max(1, Math.floor((viewWidth - viewPadding + cardGap) / (cardWidth + cardGap)))

  return (
    <div ref={viewRef} className="space-y-5">
      <h1 className="text-3xl font-medium">
        {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
      </h1>

      <FutureDocumentsSection
        title="Pinned documents"
        cardsPerRow={cardsPerRow}
        futureDocuments={futurePinnedDocuments}
      />

      {/*<Section
        title="Recently viewed"
        cardsPerRow={cardsPerRow}
        showAllButton={true}
        items={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />

      <Section
        title="Tags"
        cardsPerRow={cardsPerRow}
        showAllButton={true}
        items={['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8']}
      />*/}

      <FutureDocumentsSection
        title="All documents"
        cardsPerRow={cardsPerRow}
        futureDocuments={futurePartialDocuments}
      />
    </div>
  )
}

const FutureDocumentsSection = ({ futureDocuments, ...otherProps }) => {
  const itemForDocument = doc => ({
    key: doc.id,
    label: doc.safe_title,
    preview: doc.preview,
    as: DocumentLink,
    buttonProps: {
      documentId: doc.id,
    },
    contextMenu: (
      <DocumentMenu document={doc} />
    ),
  })

  return (
    <FutureSection
      futureItems={futureDocuments.map(
        documents => documents.map(itemForDocument)
      )}
      {...otherProps}
    />
  )
}

const FutureSection = ({ futureItems, ...otherProps }) => {
  const items = futureItems.orDefault([])

  return items.length > 0 && (
    <Section items={items} {...otherProps} />
  )
}

const Section = ({ title, items, cardsPerRow, showAllButton = false }) => {
  const SectionComponent = cardsPerRow > 1 ? CardsSection : ListSection

  return (
    <SectionComponent
      title={<h1 className="text-2xl font-medium select-none" children={title} />}
      items={items}
      showAllButton={showAllButton}
      cardsPerRow={cardsPerRow}
    />
  )
}

const CardsSection = ({ title, items, showAllButton, cardsPerRow }) => {
  const cappedItems = showAllButton ? items.slice(0, cardsPerRow) : items

  return (
    <section className="space-y-3">
      {showAllButton
        ? (
          <button type="button" className="btn btn-link-subtle flex items-center gap-0 hocus:gap-3 group transition-[gap]">
            {title}

            <div className="flex items-center gap-1 translate-y-0.5">
              <span className="whitespace-nowrap overflow-hidden w-0 group-hocus:w-full transition-[width] font-medium">Show all</span>
              <CaretRightIcon noAriaLabel />
            </div>
          </button>
        )
        : title
      }

      <div className="flex flex-wrap gap-5">
        {cappedItems.map(item => (
          <Card key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

const ListSection = ({ title, items, showAllButton }) => {
  const cappedItems = showAllButton ? items.slice(0, 5) : items

  return (
    <section className="space-y-3">
      {showAllButton
        ? (
          <div className="flex justify-between items-center gap-3">
            {title}

            <button type="button" className="btn btn-link">
              Show all
            </button>
          </div>
        )
        : title
      }

      <div className="rounded-lg border dark:border-transparent divide-y">
        {cappedItems.map(item => (
          <ListItem key={item.key} item={item} />
        ))}
      </div>
    </section>
  )
}

const Card = ({ item: { label, preview, ...itemProps }, ...otherProps }) => {
  return (
    <Item
      className="shrink-0 btn btn-solid w-64 space-y-1 p-5 border dark:border-transparent overflow-wrap-break-word"
      {...itemProps}
      {...otherProps}
    >
      <strong className="block text-lg font-medium" children={label} />

      <p className="text-sm line-clamp-4 text-slate-500 dark:text-slate-400">
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

const Item = ({ as: ItemComponent, buttonProps, contextMenu, children, ...otherProps }) => {
  const itemComponent = (
    <ItemComponent
      {...buttonProps}
      {...otherProps}
      children={children}
      onContextMenu={contextMenu !== undefined && (event => {
        event.preventDefault()
      })}
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

export default OverviewView
