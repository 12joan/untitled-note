import React, {
  ElementType,
  forwardRef,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { TOP_N_RECENTLY_VIEWED_DOCUMENTS, TOP_N_TAGS } from '~/lib/config';
import { ContextProvider, useContext } from '~/lib/context';
import { handleDragStartWithData, makeDocumentDragData } from '~/lib/dragData';
import { Future, mapFuture, orDefaultFuture } from '~/lib/monads';
import { PolyProps, PolyRef } from '~/lib/polymorphic';
import {
  DocumentLink,
  OverviewLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
  TagLink,
  TagsLink,
} from '~/lib/routes';
import { PartialDocument, Tag } from '~/lib/types';
import { useNewDocument } from '~/lib/useNewDocument';
import { DocumentMenu } from '~/components/DocumentMenu';
import { ContextMenuDropdown } from '~/components/Dropdown';
import { IconProps } from '~/components/icons/makeIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OverviewIcon from '~/components/icons/OverviewIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import { PinnedDragTarget } from '~/components/PinnedDragTarget';
import { InlinePlaceholder } from '~/components/Placeholder';
import { TagMenu } from '~/components/TagMenu';

export interface SidebarProps {
  onButtonClick?: () => void;
}

export const Sidebar = ({ onButtonClick = () => {} }: SidebarProps) => {
  const {
    futurePinnedDocuments,
    futureRecentlyViewedDocuments,
    futureTags,
    showSearchModal,
  } = useContext() as {
    futurePinnedDocuments: Future<PartialDocument[]>;
    futureRecentlyViewedDocuments: Future<PartialDocument[]>;
    futureTags: Future<Tag[]>;
    showSearchModal: () => void;
  };

  const createNewDocument = useNewDocument();

  return (
    <ContextProvider onButtonClick={onButtonClick}>
      <div className="w-48 lg:w-56 space-y-5 pb-3">
        <section className="-ml-3">
          <ButtonWithIcon
            as={OverviewLink}
            nav
            icon={OverviewIcon}
            label="Overview"
          />
          <ButtonWithIcon
            icon={NewDocumentIcon}
            label="New document"
            onClick={() => createNewDocument()}
          />
          <ButtonWithIcon
            icon={SearchIcon}
            label="Search"
            onClick={showSearchModal}
          />
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
          futureDocuments={mapFuture(futureRecentlyViewedDocuments, (docs) =>
            docs.slice(0, TOP_N_RECENTLY_VIEWED_DOCUMENTS)
          )}
        />

        <FutureTagsSection
          heading="Tags"
          headingLink={TagsLink}
          futureTags={mapFuture(futureTags, (tags) =>
            tags.slice(0, TOP_N_TAGS)
          )}
        />
      </div>
    </ContextProvider>
  );
};

const useOnButtonClick = () => {
  const { onButtonClick } = useContext() as {
    onButtonClick: () => void;
  };

  return onButtonClick;
};

interface FutureDocumentsSectionProps
  extends Omit<FutureSectionWithHeadingProps, 'futureChildren'> {
  as?: ElementType;
  futureDocuments: Future<PartialDocument[]>;
}

const FutureDocumentsSection = ({
  as = DocumentLink,
  futureDocuments,
  ...otherProps
}: FutureDocumentsSectionProps) => {
  const buttonForDocument = (doc: PartialDocument) => (
    <div key={doc.id}>
      <ContextMenuDropdown
        items={<DocumentMenu document={doc} />}
        appendTo={document.body}
      >
        <Button
          as={as}
          documentId={doc.id}
          nav
          label={doc.safe_title}
          onContextMenu={(event: MouseEvent) => event.preventDefault()}
          onDragStart={handleDragStartWithData(makeDocumentDragData(doc))}
        />
      </ContextMenuDropdown>
    </div>
  );

  return (
    <FutureSectionWithHeading
      futureChildren={mapFuture(futureDocuments, (documents) =>
        documents.map(buttonForDocument)
      )}
      {...otherProps}
    />
  );
};

interface FutureTagsSectionProps
  extends Omit<FutureSectionWithHeadingProps, 'futureChildren'> {
  futureTags: Future<Tag[]>;
}

const FutureTagsSection = ({
  futureTags,
  ...otherProps
}: FutureTagsSectionProps) => {
  const buttonForTag = (tag: Tag) => (
    <div key={tag.id}>
      <ContextMenuDropdown
        items={<TagMenu tag={tag} />}
        appendTo={document.body}
      >
        <Button
          as={TagLink}
          to={{ tagId: tag.id }}
          nav
          label={tag.text}
          onContextMenu={(event: MouseEvent) => event.preventDefault()}
        />
      </ContextMenuDropdown>
    </div>
  );

  return (
    <FutureSectionWithHeading
      futureChildren={mapFuture(futureTags, (tags) => tags.map(buttonForTag))}
      {...otherProps}
    />
  );
};

interface FutureSectionWithHeadingProps
  extends Omit<SectionWithHeadingProps, 'children'> {
  futureChildren: Future<ReactNode>;
}

const FutureSectionWithHeading = ({
  futureChildren,
  ...otherProps
}: FutureSectionWithHeadingProps) => {
  const children = orDefaultFuture(
    futureChildren,
    <InlinePlaceholder length="100%" />
  );

  if (Array.isArray(children) && children.length === 0) {
    return null;
  }

  return <SectionWithHeading children={children} {...otherProps} />;
};

interface SectionWithHeadingProps {
  heading: string;
  headingLink?: ElementType;
  children: ReactNode;
}

const SectionWithHeading = ({
  heading,
  headingLink: HeadingLink,
  children,
}: SectionWithHeadingProps) => {
  const onButtonClick = useOnButtonClick();

  const headingComponent = HeadingLink ? (
    <HeadingLink
      className="btn btn-link-subtle"
      onClick={onButtonClick}
      children={heading}
    />
  ) : (
    heading
  );

  return (
    <section>
      <strong className="text-slate-500 text-xs uppercase tracking-wide select-none dark:text-slate-400">
        {headingComponent}
      </strong>

      <div className="-ml-3">{children}</div>
    </section>
  );
};

type ButtonWithIconProps<C extends ElementType> = PolyProps<
  C,
  {
    icon: ElementType<IconProps>;
    label: string;
    onClick?: (event: MouseEvent) => void;
  }
>;

type ButtonWithIconComponent = <C extends ElementType = 'button'>(
  props: ButtonWithIconProps<C>
) => ReactElement | null;

const ButtonWithIcon: ButtonWithIconComponent = forwardRef(
  <C extends ElementType = 'button'>(
    {
      as,
      icon: Icon,
      label,
      onClick = () => {},
      ...otherProps
    }: ButtonWithIconProps<C>,
    ref: PolyRef<C>
  ) => {
    const Component = as || 'button';
    const buttonProps = Component === 'button' ? { type: 'button' } : {};

    const onButtonClick = useOnButtonClick();

    return (
      <Component
        ref={ref}
        {...(buttonProps as any)}
        className="btn w-full px-3 py-2 flex gap-2 items-center"
        onClick={(event: MouseEvent) => {
          onButtonClick();
          onClick(event);
        }}
        {...otherProps}
      >
        <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
          <Icon size="1.25em" noAriaLabel />
        </span>

        {label}
      </Component>
    );
  }
);

type ButtonProps<C extends ElementType> = PolyProps<
  C,
  {
    label: string;
    onClick?: (event: MouseEvent) => void;
  }
>;

type ButtonComponent = <C extends ElementType = 'button'>(
  props: ButtonProps<C>
) => ReactElement | null;

const Button: ButtonComponent = forwardRef(
  <C extends ElementType = 'button'>(
    { as, label, onClick = () => {}, ...otherProps }: ButtonProps<C>,
    ref: PolyRef<C>
  ) => {
    const Component = as || 'button';
    const buttonProps = Component === 'button' ? { type: 'button' } : {};

    const onButtonClick = useOnButtonClick();

    return (
      <Component
        ref={ref}
        {...(buttonProps as any)}
        className="btn w-full px-3 py-1 block text-left"
        children={label}
        onClick={(event: MouseEvent) => {
          onButtonClick();
          onClick(event);
        }}
        {...otherProps}
      />
    );
  }
);
