import { useEffect, useMemo } from 'react'
import { Mutex, tryAcquire } from 'async-mutex'

import { FutureServiceResult } from '~/lib/future'
import useStateWhileMounted from '~/lib/useStateWhileMounted'

const UPLOAD_INTERVAL = 1500

const globalDataStore = {
  recordsWithMetadata: new Map(),
  subscribers: new Map(),

  allRecordKeys() {
    return Array.from(this.recordsWithMetadata.keys())
  },

  has(key) {
    return this.recordsWithMetadata.has(key)
  },

  get(key) {
    return this.recordsWithMetadata.get(key).record
  },

  setInitial({ key, record, getRemoteVersion, uploadRecord, attributeBehaviours }) {
    this.recordsWithMetadata.set(key, {
      record,
      localVersion: getRemoteVersion(record),
      getRemoteVersion,
      uploadRecord,
      uploadMutex: new Mutex(),
      attributeBehaviours,
      onUpload: () => {},
      onUploadFailure: () => {},
    })

    this.notifySubscribers(key)
  },

  subscribe(key, subscriber) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }

    this.subscribers.get(key).add(subscriber)
  },

  unsubscribe(key, subscriber) {
    this.subscribers.get(key).delete(subscriber)
  },

  update(key, delta, { incrementLocalVersion = true, onUpload, onUploadFailure } = {}) {
    const recordWithMetadata = this.recordsWithMetadata.get(key)

    const newRecord = {
      ...recordWithMetadata.record,
      ...delta,
    }

    recordWithMetadata.record = newRecord

    if (incrementLocalVersion) {
      recordWithMetadata.localVersion += 1
    }

    this.notifySubscribers(key)

    const oldOnUpload = recordWithMetadata.onUpload
    const oldOnUploadFailure = recordWithMetadata.onUploadFailure

    recordWithMetadata.onUpload = updatedRecord => {
      oldOnUpload(updatedRecord)
      onUpload?.(updatedRecord)
      recordWithMetadata.onUpload = () => {}
      recordWithMetadata.onUploadFailure = () => {}
    }

    recordWithMetadata.onUploadFailure = error => {
      oldOnUploadFailure(error)
      onUploadFailure?.(error)
      recordWithMetadata.onUploadFailure = () => {}
    }
  },

  notifySubscribers(key) {
    const record = this.get(key)
    this.subscribers.get(key).forEach(subscriber => subscriber(record))
  },

  LOCAL_VERSION_NEWER: 'LOCAL_VERSION_NEWER',
  REMOTE_VERSION_NEWER: 'REMOTE_VERSION_NEWER',
  VERSIONS_EQUAL: 'VERSIONS_EQUAL',

  compareRecordVerisons(key, remoteVersion) {
    const recordWithMetadata = this.recordsWithMetadata.get(key)

    if (recordWithMetadata.localVersion > remoteVersion) {
      return this.LOCAL_VERSION_NEWER
    } else if (recordWithMetadata.localVersion < remoteVersion) {
      return this.REMOTE_VERSION_NEWER
    } else {
      return this.VERSIONS_EQUAL
    }
  },

  shouldUploadRecord(key) {
    const recordWithMetadata = this.recordsWithMetadata.get(key)
    return this.compareRecordVerisons(key, recordWithMetadata.getRemoteVersion(recordWithMetadata.record)) === this.LOCAL_VERSION_NEWER
  },

  recordIsOutdated(key, remoteVersion) {
    return this.compareRecordVerisons(key, remoteVersion) === this.REMOTE_VERSION_NEWER
  },

  async uploadRecord(key, { waitForLock }) {
    const alreadyAcquiredError = new Error()

    const withLock = (mutex, f) => waitForLock
      ? mutex.runExclusive(f)
      : tryAcquire(mutex, alreadyAcquiredError).runExclusive(f).catch(error => {
        if (error !== alreadyAcquiredError) {
          throw error
        }
      })

    const recordWithMetadata = this.recordsWithMetadata.get(key)

    await withLock(recordWithMetadata.uploadMutex, () => {
      const uploadingVersion = recordWithMetadata.localVersion

      return recordWithMetadata.uploadRecord(recordWithMetadata.record, uploadingVersion).then(
        remoteRecord => {
          // Reload the local record
          const { record: localRecord } = this.recordsWithMetadata.get(key)

          this.update(
            key,
            Object.keys(localRecord).reduce((delta, attribute) => {
              const { merge = undefined } = recordWithMetadata.attributeBehaviours[attribute] || {}

              return merge
                ? {
                  ...delta,
                  [attribute]: merge(localRecord[attribute], remoteRecord[attribute]),
                }
                : delta
            }, {}),
            { incrementLocalVersion: false }
          )

          recordWithMetadata.onUpload(remoteRecord)
        },

        error => recordWithMetadata.onUploadFailure(error)
      )
    })
  }
}

const uploadDirtyRecords = ({ waitForLock = false } = {}) => {
  const dirtyRecordKeys = globalDataStore.allRecordKeys().filter(key => globalDataStore.shouldUploadRecord(key))

  Promise.allSettled(dirtyRecordKeys.map(
    key => globalDataStore.uploadRecord(key, { waitForLock })
  )).then(() => setTimeout(uploadDirtyRecords, UPLOAD_INTERVAL))

  return dirtyRecordKeys.length > 0
}

setTimeout(uploadDirtyRecords, UPLOAD_INTERVAL)

window.addEventListener('beforeunload', event => {
  if (uploadDirtyRecords({ waitForLock: true })) {
    event.preventDefault()
    event.returnValue = ''
  }
})

const useSynchronisedRecord = ({
  key,
  upstreamRemoteVersion,
  getRemoteVersion,
  fetchRecord,
  uploadRecord,
  attributeBehaviours = {},
}) => {
  const [fsrRecord, setFsrRecord] = useStateWhileMounted(() => FutureServiceResult.pending())
  const [errorDuringUpload, setErrorDuringUpload] = useStateWhileMounted(false)

  useEffect(() => {
    setFsrRecord(FutureServiceResult.pending())

    if (globalDataStore.has(key) && !globalDataStore.recordIsOutdated(key, upstreamRemoteVersion)) {
      setFsrRecord(FutureServiceResult.success(globalDataStore.get(key)))
    } else {
      fetchRecord(key).then(
        record => globalDataStore.setInitial({ key, record, getRemoteVersion, uploadRecord, attributeBehaviours }),
        error => setFsrRecord(FutureServiceResult.failure(error))
      )
    }

    const subscription = record => setFsrRecord(FutureServiceResult.success(record))
    globalDataStore.subscribe(key, subscription)
    return () => globalDataStore.unsubscribe(key, subscription)
  }, [key, upstreamRemoteVersion])

  const updateRecord = delta => {
    globalDataStore.update(key, delta, {
      onUpload: () => setErrorDuringUpload(false),
      onUploadFailure: error => {
        console.error(error)
        setErrorDuringUpload(true)
      },
    })

    // Check if any updated attribute does not use delayed update
    if (Object.keys(delta).some(attribute => !attributeBehaviours[attribute]?.delayedUpdate)) {
      globalDataStore.uploadRecord(key, { waitForLock: true })
    }
  }

  return fsrRecord.map(record => [record, updateRecord, errorDuringUpload])
}

export default useSynchronisedRecord
