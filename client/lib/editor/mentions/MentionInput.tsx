import React, {
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { PointRef } from 'slate';
import { createDocument } from '~/lib/apis/document';
import { useAppContext } from '~/lib/appContext';
import {
  createPointRef,
  findNodePath,
  getPointBefore,
  insertNodes,
  insertText,
  moveSelection,
  PlateRenderElementProps,
  setSelection,
  useComboboxInput,
  useHTMLInputCursorState,
} from '~/lib/editor/plate';
import { handleCreateDocumentError } from '~/lib/handleErrors';
import { mergeRefs } from '~/lib/refUtils';
import { useCombobox } from '~/lib/useCombobox';
import { useComboboxFloating } from '~/lib/useComboboxFloating';
import { justCreatedIds } from './justCreatedIds';
import { ELEMENT_MENTION } from './plugin';
import { DocumentMention } from './types';
import { useMentionSuggestions } from './useMentionSuggestions';

const trigger = '@';

export const MentionInput = ({
  editor,
  element,
  attributes,
  children,
}: PlateRenderElementProps) => {
  const projectId = useAppContext('projectId');
  const mentionSuggestionsContainerRef = useAppContext(
    'mentionSuggestionsContainerRef'
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorState = useHTMLInputCursorState(inputRef);

  const [query, setQuery] = useState('');

  /**
   * Track the point just before the input element so we know where to
   * insertText if the combobox closes due to a selection change.
   */
  const [insertPoint, setInsertPoint] = useState<PointRef | null>(null);

  useEffect(() => {
    const path = findNodePath(editor, element);
    if (!path) return;

    const point = getPointBefore(editor, path);
    if (!point) return;

    const pointRef = createPointRef(editor, point);
    setInsertPoint(pointRef);

    return () => {
      pointRef.unref();
    };
  }, [editor, element]);

  const {
    props: plateInputProps,
    removeInput,
    cancelInput,
  } = useComboboxInput({
    cancelInputOnBlur: true,
    cursorState,
    onCancelInput: (cause) => {
      const point = insertPoint?.current ?? null;

      if (point) {
        setSelection(editor, { anchor: point, focus: point });
      }

      if (cause !== 'backspace') {
        insertText(editor, trigger + query);
      }

      if (cause === 'arrowLeft' || cause === 'arrowRight') {
        moveSelection(editor, {
          distance: 1,
          reverse: cause === 'arrowLeft',
        });
      }
    },
    ref: inputRef,
  });

  const handleSelectItem = useCallback(
    (item: DocumentMention) => {
      removeInput(true);

      insertNodes(editor, {
        type: ELEMENT_MENTION,
        ...item,
        children: [{ text: '' }],
      });

      // Select the point right after the mention
      moveSelection(editor, { unit: 'offset' });
    },
    [editor, removeInput]
  );

  const handleCreateDocument = useCallback(async () => {
    const { id } = await handleCreateDocumentError(
      createDocument(projectId, {
        title: query,
      })
    );

    justCreatedIds.add(id);

    handleSelectItem({ documentId: id, fallbackText: query });
  }, [projectId, query, handleSelectItem]);

  const suggestions = useMentionSuggestions({
    query,
    onSelectItem: handleSelectItem,
    onCreateDocument: handleCreateDocument,
    onCancel: useCallback(() => cancelInput('manual', true), [cancelInput]),
  });

  const {
    inputProps,
    showSuggestions,
    suggestionContainerProps,
    mapSuggestions,
  } = useCombobox({
    query,
    suggestions,
    keyForSuggestion: ({ key }) => key.toString(),
    onCommit: ({ onCommit }) => onCommit(),
    completeOnTab: true,
    hideWhenEmptyQuery: false,
  });

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
    <span
      {...attributes}
      className="text-primary-500 dark:text-primary-400 font-medium"
    >
      <span contentEditable={false}>
        <AutoSizingInput
          type="text"
          value={query}
          {...inputProps}
          {...plateInputProps}
          ref={mergeRefs([inputRef, comboboxFloating.inputProps.ref])}
          onBlur={(event) => {
            inputProps.onBlur(event);
            plateInputProps.onBlur(event);
          }}
          onKeyDown={(event) => {
            inputProps.onKeyDown(event);
            plateInputProps.onKeyDown(event);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            inputProps.onChange(event);
          }}
        />

        {mentionSuggestionsContainer &&
          createPortal(suggestionsContainer, mentionSuggestionsContainer)}
      </span>

      {children}
    </span>
  );
};

/**
 * To create an auto-resizing input, we render a visually hidden span
 * containing the input value and position the input element on top of it.
 * This works well for all cases except when input exceeds the width of the
 * container.
 * TODO: Use an inline Slate input instead.
 */
const AutoSizingInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ value, ...props }, ref) => {
  return (
    <>
      @
      <span className="relative min-h-[1lh]">
        <span
          className="invisible overflow-hidden text-nowrap"
          aria-hidden="true"
        >
          {value || '\u200B'}
        </span>

        <input
          ref={ref}
          type="input"
          value={value}
          className="absolute left-0 top-0 size-full bg-transparent no-focus-ring"
          {...props}
        />
      </span>
    </>
  );
});
