import { useRef, useState, useEffect } from 'react'

import useUnmounting from 'lib/useUnmounting'

const useSynchronisedRecord = ({
  initialRecord,
  synchroniseRecord,
  uncontrolledParams = [],
  syncInterval = 1500,
}) => {
  const [record, setRecord] = useState(initialRecord)

  const [clock, setClock] = useState(0)
  const [localVersion, setLocalVersion] = useState(0)
  const [remoteVersion, setRemoteVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [lastUploadFailed, setLastUploadFailed] = useState(false)

  const isDirty = localVersion > remoteVersion

  const updatePromiseCallbacks = useRef([])
  const unmounting = useUnmounting()

  useEffect(() => {
    const timeout = setInterval(() => setClock(clock => clock + 1), syncInterval)
    return () => clearTimeout(timeout)
  }, [syncInterval])

  useEffect(() => {
    if (isDirty && !isUploading) {
      setIsUploading(true)

      const uploadingVersion = localVersion

      const callbacks = updatePromiseCallbacks.current.filter(({ version }) => uploadingVersion >= version)

      synchroniseRecord(record)
        .then(updatedRecord => {
          updateRecord(
            uncontrolledParams.reduce(
              (paramsToUpdate, key) => ({ ...paramsToUpdate, [key]: updatedRecord[key] }),
              {}
            ),
            false
          )

          setRemoteVersion(uploadingVersion)
          setLastUploadFailed(false)

          callbacks.forEach(callback => callback.resolve({
            localRecord: record,
            remoteRecord: updatedRecord,
          }))
        })
        .catch(error => {
          console.error(error)
          setLastUploadFailed(true)
          callbacks.forEach(callback => callback.reject(error))
        })
        .then(() => {
          setIsUploading(false)
        })
    }
  }, [clock])

  useEffect(() => () => {
    if (unmounting.current && isDirty) {
      synchroniseRecord(record)
    }
  }, [isDirty, record])

  useEffect(() => {
    const onBeforeunload = event => {
      synchroniseRecord(record)

      event.preventDefault()
      event.returnValue = 'There are unsaved changes'
      return event.returnValue
    }

    const removeEventListener = () => {
      window.removeEventListener('beforeunload', onBeforeunload)
    }

    if (isDirty) {
      window.addEventListener('beforeunload', onBeforeunload)
      return removeEventListener
    } else {
      removeEventListener()
    }
  }, [isDirty, record])

  const updateRecord = (params, incrementLocalVersion = true) => {
    setRecord(record => ({
      ...record,
      ...params,
    }))

    if (incrementLocalVersion) {
      setLocalVersion(localVersion => localVersion + 1)

      return new Promise((resolve, reject) => {
        updatePromiseCallbacks.current.push({
          version: localVersion,
          resolve,
          reject,
        })
      })
    }
  }

  const syncStatus = isDirty
    ? (lastUploadFailed ? 'failed' : 'dirty')
    : 'upToDate'

  return [record, updateRecord, syncStatus]
}

export default useSynchronisedRecord
