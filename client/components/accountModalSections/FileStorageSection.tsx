import React from 'react'

import { useContext } from '~/lib/context'
import {
  deleteFile as deleteFileAPI,
} from '~/lib/apis/file'
import { handleDeleteFileError } from '~/lib/handleErrors'
import { filesize } from '~/lib/filesize'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { StorageQuotaUsage, File } from '~/lib/types'
import { Future, sequenceFutures, unwrapFuture } from '~/lib/monads'

import { Meter } from '~/components/Meter'
import { Dropdown, DropdownItem } from '~/components/Dropdown'
import LoadingView from '~/components/LoadingView'
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon'
import DownloadIcon from '~/components/icons/DownloadIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

export const FileStorageSection = () => {
  const { futureQuotaUsage, futureFiles } = useContext() as {
    futureQuotaUsage: Future<StorageQuotaUsage>
    futureFiles: Future<File[]>
  }

  const futureData = sequenceFutures({
    quotaUsage: futureQuotaUsage,
    files: futureFiles,
  })

  const deleteFile = (file: File) => handleDeleteFileError(
    deleteFileAPI(file.id),
  ).then(() => dispatchGlobalEvent('s3File:delete', { s3FileId: file.id }))

  const fileMenu = (file: File) => (
    <>
      <DropdownItem
        icon={DownloadIcon}
        as="a"
        href={file.url}
        target="_blank"
      >
        Download file
      </DropdownItem>

      <DropdownItem
        icon={DeleteIcon}
        className="children:text-red-500 dark:children:text-red-400"
        onClick={() => deleteFile(file)}
      >
        Delete file
      </DropdownItem>
    </>
  )

  return unwrapFuture(futureData, {
    pending: (
      <div className="flex pt-5">
        <LoadingView style={{ paddingBottom: 0 }} />
      </div>
    ),
    resolved: ({ quotaUsage, files }) => (
      <>
        <div className="space-y-2">
          <h3 className="text-lg font-medium select-none">
            Storage used ({Math.round(100 * quotaUsage.used / quotaUsage.quota)}%)
          </h3>

          <Meter
            max={quotaUsage.quota}
            value={quotaUsage.used}
          />

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filesize(quotaUsage.used)} of {filesize(quotaUsage.quota)} used<br />
            {filesize(quotaUsage.quota - quotaUsage.used)} remaining
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium select-none">
            Files ({files.length})
          </h3>

          {files.map(file => (
            <div key={file.id} className="rounded-lg flex gap-3 items-center p-3 bg-slate-50/90 dark:bg-slate-900/90">
              <div className="grow">
                {file.filename}

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {filesize(file.size)}
                  {file.role === 'project-image' && <> &middot; Used as project image</>}
                </div>
              </div>

              <Dropdown items={fileMenu(file)} placement="bottom-end">
                <button type="button" className="shrink-0 btn p-2 aspect-square">
                  <OverflowMenuIcon size="1.25em" ariaLabel="File actions" />
                </button>
              </Dropdown>
            </div>
          ))}

          {files.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              No files uploaded yet
            </div>
          )}
        </div>
      </>
    ),
  })
}
