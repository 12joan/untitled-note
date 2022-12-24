import React from 'react'

import { useContext } from '~/lib/context'
import { sequence, Future } from '~/lib/future'
import S3FilesAPI from '~/lib/resources/S3FilesAPI'
import { handleDeleteFileError } from '~/lib/handleErrors'
import filesize from '~/lib/filesize'

import Meter from '~/components/Meter'
import Dropdown, { DropdownItem } from '~/components/Dropdown'
import LoadingView from '~/components/LoadingView'
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon'
import DownloadIcon from '~/components/icons/DownloadIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const FileStorageSection = () => {
  const { futureQuotaUsage, futureFiles } = useContext()

  const futureData = sequence({
    quotaUsage: futureQuotaUsage,
    files: futureFiles,
  }, Future.resolved)

  const downloadFile = ({ url }) => window.open(url, '_blank')

  const deleteFile = file => handleDeleteFileError(
    S3FilesAPI(file.project_id).destroy(file),
  )

  const fileMenu = file => (
    <>
      <DropdownItem
        icon={DownloadIcon}
        onClick={() => downloadFile(file)}
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

  return futureData.map(({ quotaUsage, files }) => (
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
  )).orDefault(
    <div className="flex pt-5">
      <LoadingView style={{ paddingBottom: 0 }} />
    </div>
  )
}

export default FileStorageSection
