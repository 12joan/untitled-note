import React, { useMemo, useReducer, useRef, useState } from 'react';
import {
  getEditorString,
  Plate,
  PlateContent,
  PlateEditor,
  Value,
} from '@udecode/plate';
import { setLocalStorage, useLocalStorage } from '~/lib/browserStorage';
import { copyText } from '~/lib/copyText';
import { getHtmlForExport } from '~/lib/editor/getHtmlForExport';
import CopyIcon from '~/components/icons/CopyIcon';
import DownloadIcon from '~/components/icons/DownloadIcon';
import { ExportModalSectionProps } from './types';

export const ExportHTMLSection = ({
  document: doc,
  getEditorChildren,
}: ExportModalSectionProps) => {
  const [isModified, setIsModified] = useState(false);
  const [resetKey, updateResetKey] = useReducer((x) => x + 1, 0);
  const editorRef = useRef<PlateEditor | null>(null);

  const reset = () => {
    updateResetKey();
    setIsModified(false);
  };

  const includeTitle = useLocalStorage('exportHtml:includeTitle', true);
  const setIncludeTitle = (value: boolean) => {
    setLocalStorage('exportHtml:includeTitle', value);
    reset();
  };

  const initialHtml = useMemo(
    () =>
      getHtmlForExport(getEditorChildren(), {
        title: includeTitle ? doc.title || null : null,
      }),
    [includeTitle]
  );

  const getCurrentHtml = () => getEditorString(editorRef.current!, []);

  const performCopy = () => copyText(getCurrentHtml());

  const performDownload = () => {
    const blob = new Blob([getCurrentHtml()], {
      type: 'application/octet-stream',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.safe_title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <label className="flex gap-2 items-start">
        <input
          type="checkbox"
          className="ring-offset-plain-100 dark:ring-offset-plain-800 disabled:opacity-50 disabled:cursor-not-allowed"
          checked={includeTitle}
          onChange={(event) => setIncludeTitle(event.target.checked)}
          disabled={isModified}
        />

        <span className="select-none">Include document title as H1</span>
      </label>

      <div className="relative">
        <pre className="h-[400px] rounded-lg focus-within:focus-ring ring-offset-2 bg-plain-900 p-4 text-white text-sm/relaxed overflow-y-auto">
          <Plate<Value>
            editorRef={editorRef}
            key={resetKey}
            initialValue={[
              {
                type: 'content',
                children: [
                  {
                    text: initialHtml,
                  },
                ],
              },
            ]}
            onChange={() => {
              if (
                editorRef.current!.operations.some(
                  (op) => op.type !== 'set_selection'
                )
              ) {
                setIsModified(true);
              }
            }}
          >
            <PlateContent className="no-focus-ring min-h-full" />
          </Plate>
        </pre>

        {isModified && (
          <div>
            <button
              type="button"
              className="btn btn-rect btn-danger flex items-center gap-2 absolute top-3 right-3 z-50 ring-offset-plain-900"
              onClick={reset}
            >
              Undo changes
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-rect btn-primary flex items-center gap-2"
          onClick={performCopy}
        >
          <CopyIcon size="1.25em" noAriaLabel />
          Copy HTML
        </button>

        <button
          type="button"
          className="btn btn-rect btn-primary flex items-center gap-2"
          onClick={performDownload}
        >
          <DownloadIcon size="1.25em" noAriaLabel />
          Download HTML
        </button>
      </div>
    </>
  );
};
