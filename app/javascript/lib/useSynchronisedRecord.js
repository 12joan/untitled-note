import { useRef, useState, useEffect } from 'react'

import useDirty from '~/lib/useDirty'
import useUnmounting from '~/lib/useUnmounting'

const useSynchronisedRecord = ({
  initialRecord,
  synchroniseRecord,
  uncontrolledParams = [],
  syncInterval = 1500,
}) => {
  const [record, setRecord] = useState(initialRecord)

  const updatePromiseCallbacks = useRef([])
  const unmounting = useUnmounting()

  const { isDirty, localVersion, makeDirty, enqueueFetch, lastFetchFailed } = useDirty(uploadingVersion => {
    const callbacks = updatePromiseCallbacks.current.filter(({ version }) => uploadingVersion >= version)

    return synchroniseRecord(record)
      .then(updatedRecord => {
        updateRecord(
          uncontrolledParams.reduce(
            (paramsToUpdate, key) => ({ ...paramsToUpdate, [key]: updatedRecord[key] }),
            {}
          ),
          { uploadChanges: false },
        )

        callbacks.forEach(callback => callback.resolve({
          localRecord: record,
          remoteRecord: updatedRecord,
        }))
      })
      .catch(error => {
        callbacks.forEach(callback => callback.reject(error))
        return Promise.reject(error)
      })
  }, syncInterval)

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
      makeDirty()

      if (options.updateImmediately) {
        enqueueFetch()
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
    ? (lastFetchFailed ? 'failed' : 'dirty')
    : 'upToDate'

  return [record, updateRecord, syncStatus]
}

export default useSynchronisedRecord
