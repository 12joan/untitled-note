import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { fetchSearchResults } from '~/lib/apis/search';
import { useAppContext } from '~/lib/appContext';
import { searchCommands } from '~/lib/commands';
import { IIC, liftToIIC, mergeIICs, useDeployIICs } from '~/lib/iic';
import { includes } from '~/lib/includes';
import {
  FutureServiceResult,
  orDefaultFuture,
  orDefaultFutureServiceResult,
  pendingFutureServiceResult,
  promiseToFutureServiceResult,
  successFutureServiceResult,
  unwrapFutureServiceResult,
} from '~/lib/monads';
import { documentPath, projectPath, tagPath } from '~/lib/routes';
import { DocumentSearchResult } from '~/lib/types';
import { useCombobox } from '~/lib/useCombobox';
import { useModal } from '~/lib/useModal';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import DocumentIcon from '~/components/icons/DocumentIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import TagIcon from '~/components/icons/TagIcon';
import { StyledModal, StyledModalProps } from '~/components/Modal';
import { ProjectIcon } from '~/components/ProjectIcon';
import { useNavigateOrOpen } from './useNavigateOrOpen';

type Suggestion = {
  key: string;
  label: string;
  icon?: ReactNode;
  description?: string | { __html: string };
  onCommit: (altBehaviour: boolean) => IIC;
};

interface MakeDynamicSuggestionOptions<T> extends Partial<Suggestion> {
  getKey: (item: T) => Suggestion['key'];
  getLabel: (item: T) => Suggestion['label'];
  getIcon?: (item: T) => Suggestion['icon'];
  getDescription?: (item: T) => Suggestion['description'];
  action: (item: T, altBehaviour: boolean) => IIC;
}

const makeDynamicSuggestion = <T,>(
  item: T,
  handleAction: (action: IIC) => IIC,
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
  onCommit: (altBehaviour: boolean) => handleAction(action(item, altBehaviour)),
  ...rest,
});

type SuggestionSource = (
  searchQuery: string,
  handleAction: (action: IIC) => IIC
) => Suggestion[];

interface MakeListSourceOptions<T> extends MakeDynamicSuggestionOptions<T> {
  list: T[];
  include?: (item: T, searchQuery: string) => boolean;
}

const makeListSource =
  <T,>({
    list,
    include = () => true,
    ...rest
  }: MakeListSourceOptions<T>): SuggestionSource =>
  (searchQuery, handleAction) => {
    return list
      .filter((item) => include(item, searchQuery))
      .map((item) => makeDynamicSuggestion(item, handleAction, rest));
  };

interface MakeFilteredListSourceOptions<T> extends MakeListSourceOptions<T> {
  getFilterable: (item: T) => string;
}

const makeFilteredListSource = <T,>({
  include = () => true,
  getFilterable,
  ...rest
}: MakeFilteredListSourceOptions<T>): SuggestionSource =>
  makeListSource({
    include: (item, searchQuery) => {
      if (!include(item, searchQuery)) return false;
      const filterable = getFilterable(item);
      return Boolean(filterable && includes(filterable, searchQuery));
    },
    ...rest,
  });

const commandsSource = makeFilteredListSource({
  list: searchCommands,
  getFilterable: ({ label }) => label,
  getKey: ({ id }) => `command-${id}`,
  getLabel: ({ label }) => label,
  getDescription: ({ search: { description } }) => description,
  getIcon: ({ search: { icon } }) => icon,
  action: ({ action }, altBehaviour) => action(altBehaviour),
});

const SearchModal = ({ open, onClose }: Omit<StyledModalProps, 'children'>) => {
  const [iicElements, deployIIC] = useDeployIICs();

  const navigateOrOpen = useNavigateOrOpen();
  const openIIC = liftToIIC(navigateOrOpen, { layoutEffect: false });

  const projects = useAppContext('projects');
  const currentProject = useAppContext('project');
  const futureTags = useAppContext('futureTags');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');

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

  const handleAction = (action: IIC) => mergeIICs(action, liftToIIC(onClose)());

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
      commandsSource,

      // Projects
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
        action: ({ id }, newTab) =>
          openIIC(projectPath({ projectId: id }), newTab),
        description: 'Switch to project',
      }),

      // Tags
      makeFilteredListSource({
        list: tags,
        getFilterable: ({ text }) => text,
        getKey: ({ id }) => `tag-${id}`,
        getLabel: ({ text }) => text,
        icon: <TagIcon size="1.25em" noAriaLabel />,
        action: ({ id }, newTab) =>
          openIIC(tagPath({ projectId: currentProject.id, tagId: id }), newTab),
        description: 'Jump to tag',
      }),

      // Document titles
      makeFilteredListSource({
        list: partialDocuments.filter(
          ({ id }) => !searchResultDocumentIds.includes(id)
        ),
        getFilterable: ({ title }) => title,
        getKey: ({ id }) => `document-${id}`,
        getLabel: ({ title }) => title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        description: 'Open document',
        action: ({ id }, newTab) =>
          openIIC(
            documentPath({ projectId: currentProject.id, documentId: id }),
            newTab
          ),
      }),

      // Search results
      makeListSource({
        list: searchResults,
        getKey: ({ document: { id } }) => `document-${id}`, // ` <- Fix syntax highlighting
        getLabel: ({ document }) => document.safe_title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        getDescription: ({ highlights }) => {
          const snippet = highlights
            .filter(({ field }) => field === 'plain_body')
            .map(({ snippet }) => snippet)
            .join(' ');

          return snippet.length > 0 ? { __html: snippet } : 'Open document';
        },
        action: ({ document: { id } }, newTab) =>
          openIIC(
            documentPath({ projectId: currentProject.id, documentId: id }),
            newTab
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
    onCommit: ({ onCommit }, altBehaviour) => deployIIC(onCommit(altBehaviour)),
    hideWhenNoSuggestions: false,
  });

  const hint = unwrapFutureServiceResult(fsrSearchResults, {
    pending: 'Searching...',
    success: () => (suggestions.length === 0 ? 'No results' : undefined),
    failure: () => 'Something went wrong',
  });

  return (
    <>
      <StyledModal
        open={open}
        onClose={onClose}
        customBackdropClassNames={{
          overflow: null,
          bg: null,
        }}
        customPanelClassNames={{
          margin: 'mt-[20vh] mb-auto',
          width: 'narrow',
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

      {iicElements}
    </>
  );
};

export const useSearchModal = () =>
  useModal((modalProps) => <SearchModal {...modalProps} />);
