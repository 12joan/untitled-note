import React, { forwardRef } from 'react'

import { useContext, ContextProvider } from '~/lib/context'
import {
  OverviewLink,
  NewDocumentLink,
  DocumentLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
} from '~/lib/routes'
import { makeDocumentDragData, handleDragStartWithData } from '~/lib/dragData'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'

import PinnedDragTarget from '~/components/PinnedDragTarget'
import { InlinePlaceholder } from '~/components/Placeholder'
import { ContextMenuDropdown } from '~/components/Dropdown'
import DocumentMenu from '~/components/DocumentMenu'
import OverviewIcon from '~/components/icons/OverviewIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'

const Sidebar = ({ onButtonClick = () => {} }) => {
  const { futurePinnedDocuments, futureRecentlyViewedDocuments } = useContext()

  return (
    <ContextProvider onButtonClick={onButtonClick}>
      <div className="w-48 space-y-5 pb-3">
        <section className="-ml-3">
          <ButtonWithIcon as={OverviewLink} nav icon={OverviewIcon} label="Overview" />
          <ButtonWithIcon as={NewDocumentLink} icon={NewDocumentIcon} label="New document" />
          <ButtonWithIcon icon={SearchIcon} label="Search" />
        </section>

        <PinnedDragTarget indicatorClassName="right-0">
          <FutureDocumentsSection
            heading="Pinned documents"
            futureDocuments={futurePinnedDocuments}
          />
        </PinnedDragTarget>

        <FutureDocumentsSection
          as={RecentlyViewedDocumentLink}
          heading="Recently viewed"
          headingLink={RecentlyViewedLink}
          futureDocuments={futureRecentlyViewedDocuments.map(xs => xs.slice(0, 5))}
        />

        <SectionWithHeading heading="Tags">
          <Button label="Tag 1" />
          <Button label="Tag 2" />
          <Button label="Tag 3" />
        </SectionWithHeading>
      </div>
    </ContextProvider>
  )
}

const FutureDocumentsSection = ({ as = DocumentLink, futureDocuments, ...otherProps }) => {
  const buttonForDocument = doc => (
    <div key={doc.id}>
      <ContextMenuDropdown items={<DocumentMenu document={doc} />} appendTo={document.body}>
        <Button
          as={as}
          documentId={doc.id}
          nav
          label={doc.safe_title}
          onContextMenu={event => event.preventDefault()}
          onDragStart={handleDragStartWithData(makeDocumentDragData(doc))}
        />
      </ContextMenuDropdown>
    </div>
  )

  return (
    <FutureSectionWithHeading
      futureChildren={futureDocuments.map(documents => documents.map(buttonForDocument))}
      {...otherProps}
    />
  )
}

const FutureSectionWithHeading = ({ futureChildren, ...otherProps }) => {
  const children = futureChildren.orDefault(
    <InlinePlaceholder length="100%" />
  )

  return (!Array.isArray(children) || children.length > 0) && (
    <SectionWithHeading
      children={children}
      {...otherProps}
    />
  )
}

const SectionWithHeading = ({ heading, headingLink: HeadingLink, children }) => {
  const { onButtonClick } = useContext()

  const headingComponent = HeadingLink
    ? (
      <HeadingLink
        className="btn btn-link-subtle"
        onClick={onButtonClick}
        children={heading}
      />
    )
    : heading

  return (
    <section>
      <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
        {headingComponent}
      </strong>

      <div className="-ml-3">
        {children}
      </div>
    </section>
  )
}

const ButtonWithIcon = ({
  as: Component = 'button',
  icon: Icon,
  label,
  onClick = () => {},
  ...otherProps
}) => {
  const { onButtonClick } = useContext()
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className="btn btn-transparent w-full px-3 py-2 flex gap-2 items-center"
      onClick={event => {
        onButtonClick()
        onClick(event)
      }}
      {...otherProps}
    >
      <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
        <Icon size="1.25em" noAriaLabel />
      </span>

      {label}
    </Component>
  )
}

const Button = forwardRef(({
  as: Component = 'button',
  label,
  onClick = () => {},
  ...otherProps
}, ref) => {
  const { onButtonClick } = useContext()
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      ref={ref}
      {...buttonProps}
      className="btn btn-transparent w-full px-3 py-1 flex text-left"
      children={label}
      onClick={event => {
        onButtonClick()
        onClick(event)
      }}
      {...otherProps}
    />
  )
})

export default Sidebar
