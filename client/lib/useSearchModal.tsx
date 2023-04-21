import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSearchResults } from '~/lib/apis/search';
import { useContext } from '~/lib/context';
import { includes } from '~/lib/includes';
import {
  Future,
  FutureServiceResult,
  orDefaultFuture,
  orDefaultFutureServiceResult,
  pendingFutureServiceResult,
  promiseToFutureServiceResult,
  successFutureServiceResult,
  unwrapFutureServiceResult,
} from '~/lib/monads';
import {
  documentPath,
  editProjectPath,
  overviewPath,
  projectPath,
  recentlyViewedPath,
  tagPath,
  tagsPath,
} from '~/lib/routes';
import {
  DocumentSearchResult,
  PartialDocument,
  Project,
  Tag,
} from '~/lib/types';
import { useCombobox } from '~/lib/useCombobox';
import { useModal } from '~/lib/useModal';
import { useNewDocument } from '~/lib/useNewDocument';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import DocumentIcon from '~/components/icons/DocumentIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import OverviewIcon from '~/components/icons/OverviewIcon';
import RecentIcon from '~/components/icons/RecentIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import TagIcon from '~/components/icons/TagIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import { StyledModal, StyledModalProps } from '~/components/Modal';
import { ProjectIcon } from '~/components/ProjectIcon';

type Suggestion = {
  key: string;
  label: string;
  icon?: ReactNode;
  description?: string | { __html: string };
  onCommit: () => void;
};

interface MakeDynamicSuggestionOptions<T> extends Partial<Suggestion> {
  getKey: (item: T) => Suggestion['key'];
  getLabel: (item: T) => Suggestion['label'];
  getIcon?: (item: T) => Suggestion['icon'];
  getDescription?: (item: T) => Suggestion['description'];
  action: (item: T) => void;
}

const makeDynamicSuggestion = <T,>(
  item: T,
  handleAction: (action: () => void) => void,
  {
    getKey,
    getLabel,
    getIcon = () => undefined,
    getDescription = () => undefined,
    action,
    ...rest
  }: MakeDynamicSuggestionOptions<T>
): Suggestion => ({
  key: getKey(item),
  label: getLabel(item),
  icon: getIcon(item),
  description: getDescription(item),
  onCommit: () => handleAction(() => action(item)),
  ...rest,
});

type SuggestionSource = (
  searchQuery: string,
  handleAction: (action: () => void) => void
) => Suggestion[];

interface MakeListSourceOptions<T> extends MakeDynamicSuggestionOptions<T> {
  list: T[];
}

const makeListSource =
  <T,>({ list, ...rest }: MakeListSourceOptions<T>): SuggestionSource =>
  (searchQuery, handleAction) =>
    list.map((item) => makeDynamicSuggestion(item, handleAction, rest));

interface MakeFilteredListSourceOptions<T>
  extends MakeDynamicSuggestionOptions<T> {
  list: T[];
  include?: (item: T) => boolean;
  getFilterable: (item: T) => string;
}

const makeFilteredListSource =
  <T,>({
    list,
    include = () => true,
    getFilterable,
    ...rest
  }: MakeFilteredListSourceOptions<T>): SuggestionSource =>
  (searchQuery, handleAction) => {
    return list
      .filter((item) => {
        if (!include(item)) {
          return false;
        }

        const filterable = getFilterable(item);
        return filterable && includes(filterable, searchQuery);
      })
      .map((item) => makeDynamicSuggestion(item, handleAction, rest));
  };

interface MakeSingletonSourceOptions
  extends Omit<Suggestion, 'key' | 'label' | 'onCommit'> {
  name: string;
  action: () => void;
}

const makeSingletonSource =
  ({ name, action, ...rest }: MakeSingletonSourceOptions): SuggestionSource =>
  (searchQuery, handleAction) =>
    includes(name, searchQuery)
      ? [
          {
            key: name,
            label: name,
            onCommit: () => handleAction(() => action()),
            ...rest,
          },
        ]
      : [];

const SearchModal = ({ open, onClose }: Omit<StyledModalProps, 'children'>) => {
  const navigate = useNavigate();
  const performNewDocument = useNewDocument();

  const {
    projects,
    project: currentProject,
    futureTags,
    futurePartialDocuments,
  } = useContext() as {
    projects: Project[];
    project: Project;
    futureTags: Future<Tag[]>;
    futurePartialDocuments: Future<PartialDocument[]>;
  };

  const tags = orDefaultFuture(futureTags, []);
  const partialDocuments = orDefaultFuture(futurePartialDocuments, []);

  const [searchQuery, setSearchQuery] = useState('');
  const trimmedSearchQuery = searchQuery.trim();
  const isEmpty = trimmedSearchQuery === '';

  const [fsrSearchResults, setFsrSearchResults] = useState<
    FutureServiceResult<DocumentSearchResult[], any>
  >(() => successFutureServiceResult([]));

  const searchResults = useMemo(
    () => orDefaultFutureServiceResult(fsrSearchResults, []),
    [fsrSearchResults]
  );

  const searchResultDocumentIds = useMemo(
    () => searchResults.map(({ document }) => document.id),
    [searchResults]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  }, []);

  const handleAction = (action: () => void) => {
    onClose();
    action();
  };

  useEffect(() => {
    setFsrSearchResults(pendingFutureServiceResult());
  }, [trimmedSearchQuery]);

  useWaitUntilSettled(trimmedSearchQuery, () => {
    if (!isEmpty) {
      promiseToFutureServiceResult(
        fetchSearchResults(currentProject.id, trimmedSearchQuery),
        setFsrSearchResults
      );
    }
  });

  const suggestions: Suggestion[] = useMemo(() => {
    const suggestionSources: SuggestionSource[] = [
      makeSingletonSource({
        name: 'Overview',
        icon: <OverviewIcon size="1.25em" noAriaLabel />,
        description: 'Jump to overview',
        action: () => navigate(overviewPath({ projectId: currentProject.id })),
      }),

      makeSingletonSource({
        name: 'Edit project',
        icon: <SettingsIcon size="1.25em" noAriaLabel />,
        description: 'Jump to edit project',
        action: () =>
          navigate(editProjectPath({ projectId: currentProject.id })),
      }),

      makeSingletonSource({
        name: 'Recently viewed',
        icon: <RecentIcon size="1.25em" noAriaLabel />,
        description: 'Jump to recently viewed',
        action: () =>
          navigate(recentlyViewedPath({ projectId: currentProject.id })),
      }),

      makeSingletonSource({
        name: 'All tags',
        icon: <TagsIcon size="1.25em" noAriaLabel />,
        description: 'Jump to all tags',
        action: () => navigate(tagsPath({ projectId: currentProject.id })),
      }),

      makeSingletonSource({
        name: 'New document',
        icon: <NewDocumentIcon size="1.25em" noAriaLabel />,
        description: 'Create new document',
        action: performNewDocument,
      }),

      makeFilteredListSource({
        list: projects,
        include: ({ id }) => id !== currentProject.id,
        getFilterable: ({ name }) => name,
        getKey: ({ id }) => `project-${id}`,
        getLabel: ({ name }) => name,
        getIcon: (project) => (
          <ProjectIcon
            project={project}
            className="w-5 h-5 rounded text-xs shadow-sm"
          />
        ),
        action: ({ id }) => navigate(projectPath({ projectId: id })),
        description: 'Switch to project',
      }),

      makeFilteredListSource({
        list: tags,
        getFilterable: ({ text }) => text,
        getKey: ({ id }) => `tag-${id}`,
        getLabel: ({ text }) => text,
        icon: <TagIcon size="1.25em" noAriaLabel />,
        action: ({ id }) =>
          navigate(tagPath({ projectId: currentProject.id, tagId: id })),
        description: 'Jump to tag',
      }),

      makeFilteredListSource({
        list: partialDocuments.filter(
          ({ id }) => !searchResultDocumentIds.includes(id)
        ),
        getFilterable: ({ title }) => title,
        getKey: ({ id }) => `document-${id}`,
        getLabel: ({ title }) => title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        description: 'Open document',
        action: ({ id }) =>
          navigate(
            documentPath({ projectId: currentProject.id, documentId: id })
          ),
      }),

      makeListSource({
        list: searchResults,
        getKey: ({ document: { id } }) => `document-${id}`,
        getLabel: ({ document }) => document.safe_title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        getDescription: ({ highlights }) => {
          const snippet = highlights
            .filter(({ field }) => field === 'plain_body')
            .map(({ snippet }) => snippet)
            .join(' ');

          return snippet.length > 0 ? { __html: snippet } : 'Open document';
        },
        action: ({ document: { id } }) =>
          navigate(
            documentPath({ projectId: currentProject.id, documentId: id })
          ),
      }),
    ];

    return suggestionSources.flatMap((source) =>
      source(trimmedSearchQuery, handleAction)
    );
  }, [
    trimmedSearchQuery,
    projects,
    currentProject,
    tags,
    partialDocuments,
    searchResults,
  ]);

  const {
    inputProps,
    showSuggestions,
    suggestionContainerProps,
    mapSuggestions,
  } = useCombobox({
    query: trimmedSearchQuery,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onCommit }) => onCommit(),
    hideWhenNoSuggestions: false,
  });

  const hint = unwrapFutureServiceResult(fsrSearchResults, {
    pending: 'Searching...',
    success: () => (suggestions.length === 0 ? 'No results' : undefined),
    failure: () => 'Something went wrong',
  });

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      customBackdropClassNames={{
        overflow: null,
        bg: null,
      }}
      customPanelClassNames={{
        margin: 'mt-[20vh] mb-auto',
        width: 'lg:narrow',
        shadow: 'before:shadow-dialog-heavy',
        rounded: 'before:rounded-xl',
        padding: null,
        bg: 'before:bg-slate-50/75 before:dark:bg-slate-700/75',
      }}
    >
      <div className="flex px-5 py-3 gap-2 items-center">
        <SearchIcon
          size="1.25em"
          className="text-slate-500 dark:text-slate-400"
          noAriaLabel
        />

        <input
          {...inputProps}
          ref={inputRef}
          type="text"
          className="grow text-xl bg-transparent no-focus-ring"
          placeholder={`Search ${currentProject.name}`}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            inputProps.onChange?.(event);
          }}
          onKeyDown={(event) => {
            inputProps.onKeyDown?.(event);

            if (event.key === 'Escape' && !isEmpty) {
              event.preventDefault();
              event.stopPropagation();
              setSearchQuery('');
            }
          }}
        />
      </div>

      {showSuggestions && (
        <div
          {...suggestionContainerProps}
          className="px-3 py-3 border-t border-black/10 select-none max-h-[50vh] overflow-y-auto"
        >
          {mapSuggestions(
            ({
              suggestion: { label, icon, description },
              active,
              suggestionProps,
            }) => (
              <div
                {...suggestionProps}
                data-active={active}
                className="p-2 rounded-lg data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer scroll-my-3 flex gap-2"
              >
                <div className="translate-y-0.5 w-5 h-5 text-primary-500 dark:text-primary-400 data-active:text-white dark:data-active:text-white">
                  {icon}
                </div>

                <div className="grow">
                  <div>{label}</div>

                  {typeof description === 'string' && (
                    <div
                      className="text-sm text-slate-500 dark:text-slate-400 data-active:text-white dark:data-active:text-white"
                      children={description}
                    />
                  )}

                  {typeof description === 'object' && (
                    <div
                      className="text-sm"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={description}
                    />
                  )}
                </div>
              </div>
            )
          )}

          {hint && (
            <div
              className="p-2 text-slate-500 dark:text-slate-400"
              aria-live="polite"
            >
              {hint}
            </div>
          )}
        </div>
      )}
    </StyledModal>
  );
};

export const useSearchModal = () =>
  useModal((modalProps) => <SearchModal {...modalProps} />);
