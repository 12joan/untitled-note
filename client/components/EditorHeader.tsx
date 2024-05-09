import React, { memo, RefObject, useRef, useState } from 'react';
import { PlateEditor } from '@udecode/plate';
import { getFilteredChildren } from '~/lib/editor/documentDataForUpload';
import { setSelection } from '~/lib/editor/restoreSelection';
import { LocalDocument } from '~/lib/types';
import { DocumentMenu } from '~/components/DocumentMenu';
import { DocumentStatusHeader } from '~/components/DocumentStatusHeader';
import { Dropdown } from '~/components/Dropdown';
import { EditorTags } from '~/components/EditorTags';
import { EditorTitle } from '~/components/EditorTitle';
import LockIcon from '~/components/icons/LockIcon';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import UnlockIcon from '~/components/icons/UnlockIcon';
import { Tooltip } from '~/components/Tooltip';

export interface EditorHeaderProps {
  editor: PlateEditor | null;
  titleRef: RefObject<HTMLTextAreaElement>;
  workingDocument: LocalDocument;
  updateDocument: (document: Partial<LocalDocument>) => void;
  setTitle: (title: string) => void;
  isReadOnly: boolean;
  isLocked: boolean;
  temporarilyUnlock: () => void;
  resumeLock: () => void;
  isDirty: boolean;
  isFailing: boolean;
  lastSuccessfulUpdate: Date;
  openFind?: () => void;
}

export const EditorHeader = memo(
  ({
    editor,
    titleRef,
    workingDocument,
    updateDocument,
    setTitle,
    isReadOnly,
    isLocked,
    temporarilyUnlock,
    resumeLock,
    isDirty,
    isFailing,
    lastSuccessfulUpdate,
    openFind,
  }: EditorHeaderProps) => {
    const tagsRef = useRef<HTMLDivElement>();

    const [tagsVisible, setTagsVisible] = useState(
      workingDocument.tags.length > 0
    );

    const documentMenu = (
      <DocumentMenu
        isEditor
        statusHeader={
          <DocumentStatusHeader
            createdAt={new Date(workingDocument.created_at)}
            isDirty={isDirty}
            isFailing={isFailing}
            lastSuccessfulUpdate={lastSuccessfulUpdate}
          />
        }
        document={workingDocument}
        updateDocument={updateDocument}
        invalidateEditor={false}
        openFind={openFind}
        getChildrenForExport={
          editor ? () => getFilteredChildren(editor.children) : undefined
        }
      />
    );

    return (
      <>
        <div className="cursor-text" onClick={() => titleRef.current?.focus()}>
          <div className="lg:narrow flex gap-2 items-center">
            <EditorTitle
              ref={titleRef}
              initialTitle={workingDocument.title || ''}
              onChange={setTitle}
              onEnter={() =>
                editor &&
                setSelection(editor, {
                  anchor: { path: [0, 0], offset: 0 },
                  focus: { path: [0, 0], offset: 0 },
                })
              }
              textareaProps={{
                readOnly: isReadOnly,
                onDoubleClick: temporarilyUnlock,
              }}
            />

            <div
              className="contents"
              onClick={(event) => event.stopPropagation()}
            >
              {isLocked && (
                <Tooltip
                  content={isReadOnly ? 'Edit document' : 'Finish editing'}
                  placement="bottom"
                >
                  <button
                    type="button"
                    className="btn p-2 aspect-square shrink-0"
                    onClick={() => {
                      if (isReadOnly) {
                        temporarilyUnlock();
                      } else {
                        resumeLock();
                      }
                    }}
                    aria-label={isReadOnly ? 'Locked' : 'Temporarily unlocked'}
                  >
                    {isReadOnly ? (
                      <LockIcon size="1.25em" noAriaLabel />
                    ) : (
                      <UnlockIcon size="1.25em" noAriaLabel />
                    )}
                  </button>
                </Tooltip>
              )}

              {!tagsVisible && (
                <Tooltip content="Add tags" placement="bottom">
                  <button
                    type="button"
                    className="btn p-2 aspect-square shrink-0"
                    onClick={() => {
                      setTagsVisible(true);
                      tagsRef.current?.focus();
                    }}
                    aria-label="Add tags"
                  >
                    <TagsIcon size="1.25em" noAriaLabel />
                  </button>
                </Tooltip>
              )}

              <Dropdown items={documentMenu} placement="bottom-end">
                <button
                  type="button"
                  className="btn p-2 aspect-square shrink-0"
                  aria-label="Document menu"
                >
                  <OverflowMenuIcon size="1.25em" noAriaLabel />
                </button>
              </Dropdown>
            </div>
          </div>
        </div>

        <EditorTags
          ref={tagsRef}
          workingDocument={workingDocument}
          updateDocument={updateDocument}
          visible={tagsVisible}
          setVisible={setTagsVisible}
        />
      </>
    );
  }
);
