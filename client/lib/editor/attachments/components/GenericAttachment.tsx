import React from 'react';
import { filesize } from '~/lib/filesize';
import { friendlyMime } from '~/lib/friendlyMime';
import { groupedClassNames } from '~/lib/groupedClassNames';
import DownloadIcon from '~/components/icons/DownloadIcon';
import { Tooltip } from '~/components/Tooltip';
import { commonClassNames } from '../commonClassNames';
import { ExtantAttachmentProps } from '../types';

export const GenericAttachment = ({
  s3File,
  selectedClassNames,
}: ExtantAttachmentProps) => {
  const className = groupedClassNames(commonClassNames, selectedClassNames);

  const { filename, content_type: contentType, size, url } = s3File;

  return (
    <div className={className}>
      <div className="grow">
        {filename}

        <div className="text-sm text-plain-500 dark:text-plain-400">
          {friendlyMime(contentType)} &middot; {filesize(size)}
        </div>
      </div>

      <Tooltip content="Download file">
        <button
          type="button"
          className="block btn p-3 aspect-square text-plain-500 dark:text-plain-400 hocus:text-ui"
          onClick={() => window.open(url, '_blank')}
          data-testid="download-attachment"
        >
          <DownloadIcon size="1.25em" ariaLabel="Download file" />
        </button>
      </Tooltip>
    </div>
  );
};
