import React, { ReactNode, useMemo, useState } from 'react';
import { useAppContext } from '~/lib/appContext';
import { filterPredicate } from '~/lib/filterPredicate';
import { orDefaultFuture } from '~/lib/monads';
import { documentPath, tagPath } from '~/lib/routes';
import { useCombobox } from '~/lib/useCombobox';
import { useComboboxFloating } from '~/lib/useComboboxFloating';
import { useNavigateOrOpen } from '~/lib/useNavigateOrOpen';
import DocumentIcon from '~/components/icons/DocumentIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import TagIcon from '~/components/icons/TagIcon';

type QuickFindItem = {
  key: string;
  text: string;
  icon: ReactNode;
  onClick: (newTab: boolean) => void;
};

export const QuickFind = () => {
  const projectId = useAppContext('projectId');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const futureTags = useAppContext('futureTags');
  const toggleSearchModal = useAppContext('toggleSearchModal');

  const partialDocuments = useMemo(
    () => orDefaultFuture(futurePartialDocuments, []),
    [futurePartialDocuments]
  );
  const tags = useMemo(() => orDefaultFuture(futureTags, []), [futureTags]);

  const navigateOrOpen = useNavigateOrOpen();

  const items: QuickFindItem[] = useMemo(() => {
    const documentItems = partialDocuments
      .filter(({ title }) => title)
      .map((partialDocument) => ({
        key: `document-${partialDocument.id}`,
        text: partialDocument.title!,
        icon: <DocumentIcon size="1.25em" aria-label="Document" />,
        onClick: (newTab: boolean) =>
          navigateOrOpen(
            documentPath({ projectId, documentId: partialDocument.id }),
            newTab
          ),
      }))
      .sort((a, b) => a.text.length - b.text.length);

    const tagItems = tags
      .map((tag) => ({
        key: `tag-${tag.id}`,
        text: tag.text,
        icon: <TagIcon size="1.25em" aria-label="Tag" />,
        onClick: (newTab: boolean) =>
          navigateOrOpen(tagPath({ projectId, tagId: tag.id }), newTab),
      }))
      .sort((a, b) => a.text.length - b.text.length);

    return [...documentItems, ...tagItems];
  }, [partialDocuments, tags]);

  const [query, setQuery] = useState('');
  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const suggestions: QuickFindItem[] = useMemo(() => {
    if (trimmedQuery === '') return [];

    const filteredItems = items.filter((item) =>
      filterPredicate(item.text, trimmedQuery)
    );

    return [
      ...filteredItems,
      {
        key: 'search',
        text: `Search for "${trimmedQuery}"`,
        icon: <SearchIcon size="1.25em" noAriaLabel />,
        onClick: () => toggleSearchModal({ initialSearchQuery: trimmedQuery }),
      },
    ];
  }, [items, trimmedQuery, toggleSearchModal]);

  const {
    inputProps,
    showSuggestions,
    suggestionContainerProps,
    mapSuggestions,
  } = useCombobox({
    query: trimmedQuery,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onClick }, newTab) => {
      setQuery('');
      onClick(newTab);
    },
    hideWhenNoSuggestions: false,
  });

  const comboboxFloating = useComboboxFloating({ constrainWidth: true });

  return (
    <label className="block space-y-2">
      <span className="font-medium select-none">Quick find</span>

      <div
        {...comboboxFloating.inputProps}
        className="w-full xs:w-64 max-w-full"
      >
        <input
          type="text"
          className="text-input w-full"
          placeholder="Find a document or tag"
          {...inputProps}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            inputProps.onChange?.(event);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setQuery('');
              event.preventDefault();
            } else {
              inputProps.onKeyDown?.(event);
            }
          }}
        />
      </div>

      <div>
        {showSuggestions && (
          <div
            {...comboboxFloating.suggestionsProps}
            {...suggestionContainerProps}
            className="z-20 bg-plain-100/75 dark:bg-plain-700/75 backdrop-blur shadow-lg rounded-lg w-full overflow-y-auto"
          >
            {mapSuggestions(({ suggestion, active, suggestionProps }) => (
              <div
                {...suggestionProps}
                data-active={active}
                className="px-3 py-2 data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer flex items-center gap-2"
              >
                <div className="text-primary-500 dark:text-primary-400 data-active:text-inherit">
                  {suggestion.icon}
                </div>

                {suggestion.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </label>
  );
};
