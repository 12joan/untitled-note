import React, { ReactNode, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ELEMENT_MENTION,
  findMentionInput,
  getMentionOnSelectItem,
  getNodeString,
  MentionPlugin,
  PlateRenderElementProps,
  removeMentionInput,
  TMentionElement,
  TMentionInputElement,
  Value,
} from '@udecode/plate';
import { useFocused, useSelected } from 'slate-react';
import { useAppContext } from '~/lib/appContext';
import { useEditorEvent } from '~/lib/editor/imperativeEvents';
import { filterPredicate } from '~/lib/filterPredicate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { mapFuture, orDefaultFuture, unwrapFuture } from '~/lib/monads';
import { DocumentLink } from '~/lib/routes';
import { useCombobox } from '~/lib/useCombobox';
import { useComboboxFloating } from '~/lib/useComboboxFloating';
import DeleteIcon from '~/components/icons/DeleteIcon';
import DocumentIcon from '~/components/icons/DocumentIcon';
import { InlinePlaceholder } from '~/components/Placeholder';

type DocumentMention = {
  documentId: number;
  fallbackText: string;
};

export const MentionComponent = ({
  attributes,
  children,
  element,
  nodeProps,
}: PlateRenderElementProps<Value, TMentionElement>) => {
  const { documentId, fallbackText } = element as any as DocumentMention;

  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const currentDocumentId = useAppContext('documentId');

  const linkRef = useRef<HTMLAnchorElement>(null);

  const futureDocument = mapFuture(futurePartialDocuments, (partialDocuments) =>
    partialDocuments.find((doc) => doc.id === documentId)
  );

  const selected = useSelected();
  const focused = useFocused();
  const selectedAndFocused = selected && focused;

  useEditorEvent(
    'keyDown',
    (event) => {
      if (selectedAndFocused && event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        linkRef.current?.click();
      }
    },
    [selectedAndFocused]
  );

  return (
    <span
      {...attributes}
      {...nodeProps}
      className={groupedClassNames({
        nodeProps: nodeProps?.className,
        diff: 'no-default-diff-rounded',
      })}
    >
      <span contentEditable={false}>
        {unwrapFuture(futureDocument, {
          pending: <InlinePlaceholder />,
          resolved: (doc) => (
            <DocumentLink
              ref={linkRef}
              className={groupedClassNames({
                main: 'btn btn-link btn-no-rounded rounded font-medium no-underline',
                selected: selectedAndFocused && 'focus-ring',
              })}
              to={{ documentId }}
              children={
                doc?.safe_title ?? `[Deleted document: ${fallbackText}]`
              }
              onClick={(event) => {
                if (documentId === currentDocumentId) {
                  event.preventDefault();
                }
              }}
            />
          ),
        })}
      </span>

      {children}

      {/*
        Chrome workaround: Ensure that clicking to the right of a mention
        selects the following empty text node, not the mention itself.
      */}
      <span style={{ fontSize: 1, visibility: 'hidden' }}>
        {String.fromCodePoint(160)}
      </span>
    </span>
  );
};

type MentionSuggestion = {
  key: any;
  label: string;
  icon: ReactNode;
  onCommit: () => void;
};

export const MentionInputComponent = ({
  editor,
  attributes,
  children,
  element,
}: PlateRenderElementProps<Value, TMentionInputElement>) => {
  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const mentionSuggestionsContainerRef = useAppContext(
    'mentionSuggestionsContainerRef'
  );

  const handleSelectItem = (item: DocumentMention) =>
    getMentionOnSelectItem({
      key: ELEMENT_MENTION,
    })(editor, item as any);

  const query = getNodeString(element);
  const [, path] = findMentionInput(editor)!;

  const matchingDocuments = useMemo(
    () =>
      orDefaultFuture(futurePartialDocuments, [])
        .filter((doc) => doc.title && filterPredicate(doc.title, query))
        .sort((a, b) => a.title!.length - b.title!.length),
    [futurePartialDocuments, query]
  );

  const suggestions: MentionSuggestion[] = useMemo(
    () => [
      ...matchingDocuments.map((doc) => ({
        key: doc.id,
        label: doc.title!,
        icon: (
          <DocumentIcon
            size="1.25em"
            noAriaLabel
            className="text-primary-500 dark:text-primary-400 data-active:text-white"
          />
        ),
        onCommit: () =>
          handleSelectItem({
            documentId: doc.id,
            fallbackText: doc.safe_title,
          }),
      })),

      {
        key: 'cancel',
        icon: (
          <DeleteIcon
            size="1.25em"
            noAriaLabel
            className="text-red-500 dark:text-red-400 data-active:text-white"
          />
        ),
        label: 'Cancel mention',
        onCommit: () => removeMentionInput(editor, path),
      },
    ],
    [matchingDocuments, path]
  );

  const {
    inputProps,
    showSuggestions,
    suggestionContainerProps,
    mapSuggestions,
  } = useCombobox({
    query,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onCommit }) => onCommit(),
    completeOnTab: true,
    hideWhenEmptyQuery: false,
  });

  // onFocus and onBlur are intentionally not used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange, onKeyDown, onFocus, onBlur, ...restInputProps } =
    inputProps;

  useEditorEvent('change', () => (onChange as any)?.(), [onChange]);
  useEditorEvent('keyDown', (event) => onKeyDown?.(event as any), [onKeyDown]);

  const comboboxFloating = useComboboxFloating({
    flip: true,
  });

  const suggestionsContainer = showSuggestions && (
    <div
      {...comboboxFloating.suggestionsProps}
      {...suggestionContainerProps}
      className="z-20 bg-plain-100/75 dark:bg-plain-700/75 backdrop-blur shadow-lg rounded-lg w-48 max-w-full overflow-y-auto"
    >
      {mapSuggestions(
        ({ suggestion: { icon, label }, active, suggestionProps }) => (
          <div
            {...suggestionProps}
            data-active={active}
            className="px-3 py-2 data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer flex gap-2 items-center"
          >
            {icon}
            <span>{label}</span>
          </div>
        )
      )}
    </div>
  );

  const mentionSuggestionsContainer = mentionSuggestionsContainerRef.current;

  return (
    <>
      <span
        {...attributes}
        {...comboboxFloating.inputProps}
        {...restInputProps}
        className="btn btn-link cursor-text font-medium"
      >
        @{children}
      </span>

      {mentionSuggestionsContainer &&
        createPortal(suggestionsContainer, mentionSuggestionsContainer)}
    </>
  );
};

export const mentionOptions: {
  options: MentionPlugin;
} = {
  options: {
    createMentionNode: (x) => x as any,
  },
};
