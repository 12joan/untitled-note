import React, { useMemo } from 'react'

import { useContext } from '~/lib/context'
import { createAttachmentPlugin } from './plugin'
import { ELEMENT_ATTACHMENT, ELEMENT_UPLOADING_ATTACHMENT } from './constants'

import Attachment from './components/Attachment'
import UploadingAttachment from './components/UploadingAttachment'

const useAttachmentPlugins = () => {
  const { projectId, futureRemainingQuota, showAccountModal } = useContext()

  return useMemo(() => [
    createAttachmentPlugin({
      options: {
        projectId,
        availableSpace: futureRemainingQuota.orDefault(Infinity),
        showFileStorage: () => showAccountModal({ initialSection: 'fileStorage' }),
      },
    }),
  ], [projectId, futureRemainingQuota])
}

export {
  ELEMENT_ATTACHMENT,
  ELEMENT_UPLOADING_ATTACHMENT,
  useAttachmentPlugins,
  Attachment,
  UploadingAttachment,
}
