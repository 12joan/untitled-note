import React, {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  PlateEditor,
  TEditor,
  TElement,
  toDOMRange,
  TText,
} from '@udecode/plate';
import { Path, Range as SlateRange } from 'slate';
import { useAppContext } from '~/lib/appContext';
import { FIND_SUPPORTED } from '~/lib/environment';
import { useGlobalKeyboardShortcut } from '~/lib/useGlobalKeyboardShortcut';
import { useStateWhenSettled } from '~/lib/useStateWhenSettled';
import ChevronLeftIcon from '~/components/icons/ChevronLeftIcon';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';

const HIGHLIGHT_LIMIT = 3000;

type DOMRange = Range;

const forEachTextNode = (
  { children }: TEditor | TElement,
  callback: (node: TText, path: Path) => void,
  parentPath: Path = []
) => {
  children.forEach((child, index) => {
    const path = [...parentPath, index];

    if ('text' in child) {
      callback(child as TText, path);
    } else if ('children' in child && child.children.length > 0) {
      forEachTextNode(child, callback, path);
    }
  });
};

const getMatches = (editor: PlateEditor, query: string) => {
  if (query === '') return [];

  const matches: SlateRange[] = [];
  const queryLength = query.length;
  const lowerCaseQuery = query.toLowerCase();

  forEachTextNode(editor, (textNode, path) => {
    const text = textNode.text.toLowerCase();
    let offset = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const index = text.indexOf(lowerCaseQuery, offset);

      if (index === -1) break;

      matches.push({
        anchor: { path, offset: index },
        focus: { path, offset: index + queryLength },
      });

      offset = index + queryLength;
    }
  });

  return matches;
};

export interface UseFindOptions {
  editor?: PlateEditor;
  restoreSelection: () => void;
  setSelection: (range: SlateRange) => void;
}

export type UseFindResult = {
  findDialog?: ReactNode;
  openFind?: () => void;
};

export const useFind = ({
  editor,
  restoreSelection,
  setSelection,
}: UseFindOptions) => {
  if (!FIND_SUPPORTED) return {};

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [query, settledQuery, rawSetQuery, setQueryWithoutWaiting] =
    useStateWhenSettled('', { debounceTime: 200 });
  const [matches, setMatches] = useState<SlateRange[]>([]);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [scrollToCurrentMatchKey, scrollToCurrentMatch] = useReducer(
    (x) => x + 1,
    0
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // When the find dialog is opened, focus the input
  const open = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  // When the find dialog is closed, reset the query and matches
  const close = () => {
    setIsOpen(false);
    setQueryWithoutWaiting('');
    setMatches([]);
    setCurrentMatch(null);

    // If the current match exists, select it; otherwise, restore the selection
    const currentMatchRange = currentMatch !== null && matches[currentMatch];

    if (currentMatchRange) {
      setSelection(currentMatchRange);
    } else {
      restoreSelection();
    }
  };

  /**
   * When the user presses Meta+F, open the find dialog. If the find dialog was
   * already open, close it and let the browser handle the keyboad shortcut.
   */
  // TODO: Deprecate useGlobalKeyboardShortcut
  useGlobalKeyboardShortcut('MetaF', (event) => {
    if (event.target === inputRef.current) {
      close();
    } else {
      event.preventDefault();
      open();
    }
  });

  // When the query changes, reset the current match
  const setQuery = (query: string) => {
    setCurrentMatch(null);
    rawSetQuery(query);
  };

  /**
   * Recompute matches when the query changes or the input gains focus, but only
   * if the find dialog is open and the input is focused
   */
  useEffect(() => {
    if (editor && isOpen && isFocused) {
      setMatches(getMatches(editor, settledQuery));
    }
  }, [isOpen, isFocused, settledQuery]);

  // If the current match needs to be set, set it to the first match
  useEffect(() => {
    if (
      matches.length > 0 &&
      (currentMatch === null || currentMatch >= matches.length)
    ) {
      setCurrentMatch(0);
    }
  }, [matches]);

  const matchDOMRanges: DOMRange[] = useMemo(
    () =>
      editor
        ? matches.map((slateRange) => toDOMRange(editor, slateRange)!)
        : [],
    [matches]
  );

  // Highlight matches
  useEffect(() => {
    if (FIND_SUPPORTED && editor) {
      const currentMatchRange =
        isFocused && currentMatch !== null
          ? matchDOMRanges[currentMatch]
          : null;

      const otherMatchRanges = matchDOMRanges.filter(
        (_, index) => index !== currentMatch
      );

      // Only highlight up to HIGHLIGHT_LIMIT matches either side of the current match
      const limitedOtherMatchRangesStart =
        currentMatch === null ? 0 : Math.max(0, currentMatch - HIGHLIGHT_LIMIT);

      const limitedOtherMatchRangesEnd =
        currentMatch === null
          ? matches.length
          : Math.min(matches.length, currentMatch + HIGHLIGHT_LIMIT);

      const limitedOtherMatchRanges = otherMatchRanges.slice(
        limitedOtherMatchRangesStart,
        limitedOtherMatchRangesEnd
      );

      // Passing too many arguments to the Highlight constructor causes an error
      const otherMatchesHighlight = new Highlight();
      limitedOtherMatchRanges.forEach((range) =>
        otherMatchesHighlight.add(range)
      );
      CSS.highlights.set('find-result', otherMatchesHighlight);

      if (currentMatchRange) {
        CSS.highlights.set(
          'find-result-current',
          new Highlight(currentMatchRange)
        );
      } else {
        CSS.highlights.delete('find-result-current');
      }
    }
  }, [matchDOMRanges, currentMatch, isFocused]);

  // Scroll to the current match
  useEffect(() => {
    const currentMatchRange =
      currentMatch !== null && matchDOMRanges[currentMatch];

    if (currentMatchRange) {
      currentMatchRange.startContainer?.parentElement?.scrollIntoView({
        block: 'center',
      });
    }
  }, [currentMatch, scrollToCurrentMatchKey]);

  const changeMatch = (delta: number) => {
    if (matches.length === 1) {
      scrollToCurrentMatch();
    } else {
      setCurrentMatch(
        ((currentMatch ?? 0) + delta + matches.length) % matches.length
      );
    }
  };

  return {
    findDialog: isOpen && (
      <FindDialog
        query={query}
        setQuery={setQuery}
        inputRef={inputRef}
        currentMatch={currentMatch}
        totalMatches={matches.length}
        changeMatch={changeMatch}
        showMatches={
          settledQuery.length > 0 &&
          (matches.length === 0 || currentMatch !== null)
        }
        setFocused={setIsFocused}
        onClose={close}
      />
    ),
    openFind: open,
  };
};

interface FindDialogProps {
  query: string;
  setQuery: (query: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  currentMatch: number | null;
  totalMatches: number;
  changeMatch: (delta: number) => void;
  showMatches: boolean;
  setFocused: (isFocused: boolean) => void;
  onClose: () => void;
}

const FindDialog = ({
  query,
  setQuery,
  inputRef,
  currentMatch,
  totalMatches,
  changeMatch,
  showMatches,
  setFocused,
  onClose,
}: FindDialogProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topBarHeight = useAppContext('topBarHeight');

  const handleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && totalMatches > 0) {
      changeMatch(1);
    }
  };

  const handleContainerKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleFocus = () => setFocused(true);

  const handleBlur = () =>
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setFocused(false);
      }
    }, 0);

  const matchComponents =
    showMatches &&
    (totalMatches > 0 ? (
      <>
        <button
          type="button"
          className="btn p-2 2xs:aspect-square max-2xs:grow flex justify-center"
          onClick={() => changeMatch(-1)}
        >
          <ChevronLeftIcon size="1.25em" ariaLabel="Previous match" />
        </button>

        <span className="select-none" role="status">
          {currentMatch! + 1} of {totalMatches}
        </span>

        <button
          type="button"
          className="btn p-2 2xs:aspect-square max-2xs:grow flex justify-center"
          onClick={() => changeMatch(1)}
        >
          <ChevronRightIcon size="1.25em" ariaLabel="Next match" />
        </button>
      </>
    ) : (
      <span
        className="select-none text-plain-500 dark:text-plain-400"
        role="status"
      >
        No matches
      </span>
    ));

  return (
    <div
      ref={containerRef}
      className="fixed sm:sticky z-[15] h-0 max-sm:left-5 max-sm:right-5"
      style={{ top: topBarHeight }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleContainerKeyDown}
    >
      <div className="lg:narrow bg-plain-100/75 dark:bg-plain-700/75 backdrop-blur-lg shadow-dialog rounded-lg">
        <div className="flex gap-1 items-center chidren:shrink-0 pr-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Find in document"
            className="grow w-0 bg-transparent p-3 pr-0 no-focus-ring"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />

          <div className="hidden 2xs:contents">{matchComponents}</div>

          <button
            type="button"
            className="btn p-2 aspect-square"
            onClick={onClose}
          >
            <LargeCloseIcon size="1.25em" ariaLabel="Close" />
          </button>
        </div>

        {matchComponents && (
          <div className="flex items-center justify-center 2xs:hidden p-2 pt-0 gap-2 children:shrink-0">
            {matchComponents}
          </div>
        )}
      </div>
    </div>
  );
};
