import React, { useMemo } from 'react';
import { setLocalStorage, useLocalStorage } from '~/lib/browserStorage';
import { copyText } from '~/lib/copyText';
import { getHtmlForExport } from '~/lib/editor/getHtmlForExport';
import CopyIcon from '~/components/icons/CopyIcon';
import DownloadIcon from '~/components/icons/DownloadIcon';
import { DocumentSettingsModalSectionProps } from './types';

export const ExportHTMLSection = ({
  document: doc,
  getChildrenForExport,
}: DocumentSettingsModalSectionProps) => {
  const includeTitle = useLocalStorage('exportHtml:includeTitle', true);
  const setIncludeTitle = (value: boolean) => {
    setLocalStorage('exportHtml:includeTitle', value);
  };

  const html = useMemo(
    () =>
      getHtmlForExport(getChildrenForExport(), {
        title: includeTitle ? doc.title || null : null,
      }),
    [doc.title, includeTitle]
  );

  const performCopy = () => copyText(html);

  const performDownload = () => {
    const blob = new Blob([html], {
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
        />

        <span className="select-none">Include document title as H1</span>
      </label>

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

      <pre className="grow rounded-lg bg-plain-900 p-4 text-white text-sm/relaxed overflow-x-auto">
        {html}
      </pre>
    </>
  );
};
