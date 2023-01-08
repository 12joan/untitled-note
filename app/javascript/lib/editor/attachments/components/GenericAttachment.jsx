import React, { useRef } from 'react'

import friendlyMime from '~/lib/friendlyMime'
import filesize from '~/lib/filesize'
import groupedClassNames from '~/lib/groupedClassNames'
import commonClassNames from '../commonClassNames'

import Tooltip from '~/components/Tooltip'
import DownloadIcon from '~/components/icons/DownloadIcon'

const GenericAttachment = ({ s3File, selectedClassNames, useOnEnter }) => {
  const buttonRef = useRef()
  useOnEnter(() => buttonRef.current.click())

  const className = groupedClassNames(commonClassNames, selectedClassNames)

  const {
    filename,
    content_type: contentType,
    size,
    url,
  } = s3File

  return (
    <div className={className}>
      <div className="grow">
        {filename}

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {friendlyMime(contentType)} &middot; {filesize(size)}
        </div>
      </div>

      <Tooltip content="Download file">
        <a
          ref={buttonRef}
          href={url}
          target="_blank"
          className="block btn p-3 aspect-square text-slate-500 dark:text-slate-400 hocus:text-ui"
          onClick={event => event.stopPropagation()}
        >
          <DownloadIcon size="1.25em" ariaLabel="Download file" />
        </a>
      </Tooltip>
    </div>
  )
}

export default GenericAttachment
