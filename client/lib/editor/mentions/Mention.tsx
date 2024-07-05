import React, { useEffect, useRef } from 'react';
import { useFocused, useSelected } from 'slate-react';
import { useAppContext } from '~/lib/appContext';
import { useEditorEvent } from '~/lib/editor/imperativeEvents';
import {
  findNodePath,
  PlateRenderElementProps,
  setNodes,
  Value,
} from '~/lib/editor/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { mapFuture, orDefaultFuture, unwrapFuture } from '~/lib/monads';
import { DocumentLink } from '~/lib/routes';
import { InlinePlaceholder } from '~/components/Placeholder';
import { justCreatedIds } from './justCreatedIds';
import { MentionElement } from './types';

export const Mention = ({
  attributes,
  children,
  element,
  nodeProps,
  editor,
}: PlateRenderElementProps<Value, MentionElement>) => {
  const { documentId, fallbackText } = element;

  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const currentDocumentId = useAppContext('documentId');

  const linkRef = useRef<HTMLAnchorElement>(null);

  const futureDocument = mapFuture(futurePartialDocuments, (partialDocuments) =>
    partialDocuments.find((doc) => doc.id === documentId)
  );

  const selected = useSelected();
  const focused = useFocused();
  const selectedAndFocused = selected && focused;

  useEffect(() => {
    const doc = orDefaultFuture(futureDocument, undefined);
    if (!doc) return;

    // Once the document exists, it is no longer "just created"
    justCreatedIds.delete(documentId);

    // Keep fallback text up to date
    if (fallbackText !== doc.safe_title) {
      setNodes(
        editor,
        { fallbackText: doc.safe_title },
        { at: findNodePath(editor, element) }
      );
    }
  }, [documentId, futureDocument]);

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
                doc?.safe_title ??
                (justCreatedIds.has(documentId)
                  ? fallbackText
                  : `[Deleted document: ${fallbackText}]`)
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
