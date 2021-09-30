import { useRef, useState, useEffect } from 'react'

import useCounter from 'lib/useCounter'
import useUnmounting from 'lib/useUnmounting'

const useSynchronisedRecord = ({
  initialRecord,
  synchroniseRecord,
  uncontrolledParams = [],
  syncInterval = 1500,
}) => {
  const [record, setRecord] = useState(initialRecord)

  const [clock, incrementClock] = useCounter()
  const [localVersion, incrementLocalVersion] = useCounter()
  const [remoteVersion, setRemoteVersion] = useState(localVersion)
  const [isUploading, setIsUploading] = useState(false)
  const [lastUploadFailed, setLastUploadFailed] = useState(false)

  const isDirty = localVersion > remoteVersion

  const updatePromiseCallbacks = useRef([])
  const unmounting = useUnmounting()

  useEffect(() => {
    const timeout = setInterval(incrementClock, syncInterval)
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
            { uploadChanges: false },
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

  const updateRecord = (params, options = {}) => {
    options = {
      uploadChanges: true,
      updateImmediately: true,
      ...options,
    }

    setRecord(record => ({
      ...record,
      ...params,
    }))

    if (options.uploadChanges) {
      incrementLocalVersion()

      if (options.updateImmediately) {
        incrementClock()
      }

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
