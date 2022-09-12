import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'

import CaretRightIcon from '~/components/icons/CaretRightIcon'

const OverviewView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const remPixels = parseFloat(getComputedStyle(document.body).fontSize)
  const viewPadding = 2 * 5 / 4 * remPixels
  const cardWidth = 64 / 4 * remPixels
  const cardGap = 5 / 4 * remPixels
  const cardsPerRow = Math.max(1, Math.floor((viewWidth - viewPadding + cardGap) / (cardWidth + cardGap)))

  return (
    <div ref={viewRef} className="p-5 space-y-5">
      <Section
        title="Pinned documents"
        cardsPerRow={cardsPerRow}
        items={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />

      <Section
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
      />

      <Section
        title="All documents"
        cardsPerRow={cardsPerRow}
        items={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />
    </div>
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
        {cappedItems.map((doc, index) => (
          <button key={index} type="button" className="shrink-0 btn btn-solid w-64 space-y-1 p-5 border text-left flex flex-col dark:border-transparent">
            <strong className="text-lg font-medium" children={doc} />

            <p className="text-sm line-clamp-4 text-slate-500 dark:text-slate-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nunc aliquet nunc, eget aliquet nunc nisl eget nisl. Sed euismod, nunc vel tincidunt lacinia, nisl nunc aliquet nunc, eget aliquet nunc nisl eget nisl.
            </p>
          </button>
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
        {cappedItems.map((doc, index) => (
          <ListItem key={index}>
            <span className="shrink-0" children={doc} />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nunc aliquet nunc, eget aliquet nunc nisl eget nisl.
            </span>
          </ListItem>
        ))}
      </div>
    </section>
  )
}

const ListItem = ({ children, ...otherProps }) => {
  return (
    <button
      type="button"
      className="w-full p-3 flex items-center gap-5 dark:bg-slate-800 hocus:bg-slate-100 dark:hocus:bg-slate-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
      children={children}
      {...otherProps}
    />
  )
}


export default OverviewView
