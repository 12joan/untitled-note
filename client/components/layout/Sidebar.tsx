import React, {
  ElementType,
  forwardRef,
  memo,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { TOP_N_RECENTLY_VIEWED_DOCUMENTS, TOP_N_TAGS } from '~/lib/config';
import { handleDragStartWithData, makeDocumentDragData } from '~/lib/dragData';
import { Future, mapFuture, orDefaultFuture } from '~/lib/monads';
import { PolyProps, PolyRef } from '~/lib/polymorphic';
import {
  DocumentLink,
  NewDocumentLink,
  OverviewLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
  TagLink,
  TagsLink,
} from '~/lib/routes';
import { PartialDocument, Tag } from '~/lib/types';
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

export const Sidebar = memo(({ onButtonClick = () => {} }: SidebarProps) => {
  const futurePinnedDocuments = useAppContext('futurePinnedDocuments');
  const futureRecentlyViewedDocuments = useAppContext(
    'futureRecentlyViewedDocuments'
  );
  const futureTags = useAppContext('futureTags');
  const toggleSearchModal = useAppContext('toggleSearchModal');

  return (
    <AppContextProvider onButtonClick={onButtonClick}>
      <div className="w-48 lg:w-56 space-y-5 pb-3">
        <section className="-ml-3">
          <ButtonWithIcon
            as={OverviewLink}
            nav
            icon={OverviewIcon}
            label="Overview"
          />
          <ButtonWithIcon
            as={NewDocumentLink}
            icon={NewDocumentIcon}
            label="New document"
          />
          <ButtonWithIcon
            icon={SearchIcon}
            label="Search"
            onClick={toggleSearchModal}
          />
        </section>

        <PinnedDragTarget indicatorClassName="right-0">
          <FutureDocumentsSection
            heading="Pinned documents"
            futureDocuments={futurePinnedDocuments}
            testId="sidebar-pinned-documents"
          />
        </PinnedDragTarget>

        <FutureDocumentsSection
          buttonAs={RecentlyViewedDocumentLink}
          heading="Recently viewed"
          headingLink={RecentlyViewedLink}
          futureDocuments={mapFuture(futureRecentlyViewedDocuments, (docs) =>
            docs.slice(0, TOP_N_RECENTLY_VIEWED_DOCUMENTS)
          )}
          testId="sidebar-recently-viewed-documents"
        />

        <FutureTagsSection
          heading="Tags"
          headingLink={TagsLink}
          futureTags={mapFuture(futureTags, (tags) =>
            tags.slice(0, TOP_N_TAGS)
          )}
          testId="sidebar-tags"
        />
      </div>
    </AppContextProvider>
  );
});

interface FutureDocumentsSectionProps<ButtonAs extends typeof DocumentLink>
  extends Omit<FutureSectionWithHeadingProps, 'futureChildren'> {
  buttonAs?: ButtonAs;
  futureDocuments: Future<PartialDocument[]>;
}

const FutureDocumentsSection = <ButtonAs extends typeof DocumentLink>({
  buttonAs,
  futureDocuments,
  ...otherProps
}: FutureDocumentsSectionProps<ButtonAs>) => {
  const buttonForDocument = (doc: PartialDocument) => (
    <div key={doc.id}>
      <ContextMenuDropdown items={<DocumentMenu document={doc} />}>
        <Button
          as={buttonAs || DocumentLink}
          to={{ documentId: doc.id }}
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
      <ContextMenuDropdown items={<TagMenu tag={tag} />}>
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
  testId?: string;
  children: ReactNode;
}

const SectionWithHeading = ({
  heading,
  headingLink: HeadingLink,
  testId,
  children,
}: SectionWithHeadingProps) => {
  const onButtonClick = useAppContext('onButtonClick');

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
    <section data-testid={testId}>
      <strong className="text-plain-500 text-xs uppercase tracking-wide select-none dark:text-plain-400">
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

    const onButtonClick = useAppContext('onButtonClick');

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
        <span className="text-primary-500 dark:text-primary-400 window-inactive:text-plain-500 dark:window-inactive:text-plain-400">
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

    const onButtonClick = useAppContext('onButtonClick');

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
