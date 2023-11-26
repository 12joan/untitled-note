import React from 'react';
import { deleteFile as deleteFileAPI } from '~/lib/apis/file';
import { useAppContext } from '~/lib/appContext';
import { filesize } from '~/lib/filesize';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { handleDeleteFileError } from '~/lib/handleErrors';
import { sequenceFutures, unwrapFuture } from '~/lib/monads';
import { S3File } from '~/lib/types';
import { Dropdown, DropdownItem } from '~/components/Dropdown';
import DeleteIcon from '~/components/icons/DeleteIcon';
import DownloadIcon from '~/components/icons/DownloadIcon';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import { LoadingView } from '~/components/LoadingView';
import { Meter } from '~/components/Meter';
import { Tooltip } from '../Tooltip';

export const FileStorageSection = () => {
  const futureQuotaUsage = useAppContext('futureQuotaUsage');
  const futureFiles = useAppContext('futureFiles');

  const futureData = sequenceFutures({
    quotaUsage: futureQuotaUsage,
    files: futureFiles,
  });

  return unwrapFuture(futureData, {
    pending: (
      <div className="flex pt-5">
        <LoadingView style={{ paddingBottom: 0 }} />
      </div>
    ),
    resolved: ({ quotaUsage, files }) => (
      <>
        <div className="space-y-2">
          <h3 className="h3 select-none">
            Storage used (
            {Math.round((100 * quotaUsage.used) / quotaUsage.quota)}%)
          </h3>

          <Meter max={quotaUsage.quota} value={quotaUsage.used} />

          <div className="text-sm text-plain-500 dark:text-plain-400">
            {filesize(quotaUsage.used)} of {filesize(quotaUsage.quota)} used
            <br />
            {filesize(quotaUsage.quota - quotaUsage.used)} remaining
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="h3 select-none">Files ({files.length})</h3>
          <FileList files={files} />
        </div>
      </>
    ),
  });
};

interface FileListProps {
  files: S3File[];
}

const FileList = ({ files }: FileListProps) => {
  return (
    <>
      {files.map((file) => (
        <FileEntry key={file.id} {...file} />
      ))}

      {files.length === 0 && (
        <div className="text-sm text-plain-500 dark:text-plain-400">
          No files uploaded yet
        </div>
      )}
    </>
  );
};

type Badge = {
  text: string;
  hint: string;
  color: 'neutral' | 'danger';
};

const FileEntry = ({
  id,
  url,
  filename,
  size,
  role,
  became_unused_at: becameUnusedAt,
  do_not_delete_unused: doNotDeleteUnused,
}: S3File) => {
  const friendlyRole: string = {
    'project-image': 'Project image',
    attachment: 'Attachment',
  }[role];

  const badges = (() => {
    const badges: Badge[] = [];

    if (becameUnusedAt) {
      if (doNotDeleteUnused) {
        badges.push({
          text: 'Unused',
          hint: 'This file is unused but will not be deleted',
          color: 'neutral',
        });
      } else {
        badges.push({
          text: 'Unused',
          hint: 'This file is unused and will be deleted soon',
          color: 'danger',
        });
      }
    }

    return badges;
  })();

  const performDelete = () =>
    handleDeleteFileError(deleteFileAPI(id)).then(() =>
      dispatchGlobalEvent('s3File:delete', { s3FileId: id })
    );

  const fileMenu = (
    <>
      <DropdownItem icon={DownloadIcon} as="a" href={url} target="_blank">
        Download file
      </DropdownItem>

      <DropdownItem
        icon={DeleteIcon}
        className="children:text-red-500 dark:children:text-red-400"
        onClick={performDelete}
      >
        Delete file
      </DropdownItem>
    </>
  );

  return (
    <div className="rounded-lg flex gap-3 items-center p-3 bg-plain-50/90 dark:bg-plain-900/90">
      <div className="grow">
        <div className="flex gap-2 items-center">
          {filename}

          {badges.map((badge) => (
            <Badge key={badge.text} {...badge} />
          ))}
        </div>

        <div className="text-sm text-plain-500 dark:text-plain-400">
          {friendlyRole} &middot; {filesize(size)}
        </div>
      </div>

      <Dropdown items={fileMenu} placement="bottom-end">
        <button
          type="button"
          className="shrink-0 btn p-2 aspect-square"
          aria-label="File actions"
        >
          <OverflowMenuIcon size="1.25em" noAriaLabel />
        </button>
      </Dropdown>
    </div>
  );
};

const Badge = ({ text, hint, color }: Badge) => {
  return (
    <Tooltip content={hint}>
      <span
        className={groupedClassNames({
          base: 'text-xs rounded-sm px-1 py-0.5 select-none',
          color: {
            neutral: 'bg-plain-200 dark:bg-plain-600',
            danger: 'bg-red-600 text-white',
          }[color],
        })}
        tabIndex={0}
      >
        {text}
      </span>
    </Tooltip>
  );
};
