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
        documents={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />

      <Section
        title="Recently viewed"
        cardsPerRow={cardsPerRow}
        showAllButton={true}
        documents={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />

      <Section
        title="Tags"
        cardsPerRow={cardsPerRow}
        showAllButton={true}
        documents={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />

      <Section
        title="All documents"
        cardsPerRow={cardsPerRow}
        documents={['Document 1', 'Document 2', 'Document 3', 'Document 4', 'Document 5', 'Document 6', 'Document 7', 'Document 8']}
      />
    </div>
  )
}

const Section = ({ title, documents, cardsPerRow, showAllButton = false }) => {
  const SectionComponent = cardsPerRow > 1 ? CardsSection : ListSection

  return (
    <SectionComponent
      title={<h1 className="text-2xl font-medium select-none" children={title} />}
      documents={documents}
      showAllButton={showAllButton}
      cardsPerRow={cardsPerRow}
    />
  )
}

const CardsSection = ({ title, documents, showAllButton, cardsPerRow }) => {
  const cappedDocuments = showAllButton ? documents.slice(0, cardsPerRow) : documents

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
        {cappedDocuments.map((doc, index) => (
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

const ListSection = ({ title, documents, showAllButton }) => {
  const cappedDocuments = showAllButton ? documents.slice(0, 5) : documents

  return (
    <section className="space-y-3">
      {title}

      <div className="rounded-lg border divide-y dark:bg-slate-800 overflow-hidden">
        {cappedDocuments.map((doc, index) => (
          <div key={index} className="p-3 flex items-center gap-5 even:bg-slate-50 dark:even:bg-slate-900">
            <span className="shrink-0" children={doc} />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nunc aliquet nunc, eget aliquet nunc nisl eget nisl.
            </span>
          </div>
        ))}

        {showAllButton && (
          <button type="button" className="w-full text-left p-3 even:bg-slate-50 dark:even:bg-slate-900">
            Show all
          </button>
        )}
      </div>
    </section>
  )
}

export default OverviewView
