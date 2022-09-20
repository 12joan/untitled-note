import { useState, useEffect, useMemo } from 'react'
import { Mutex, tryAcquire } from 'async-mutex'

import Future from '~/lib/future'

const UPLOAD_INTERVAL = 1500

const BEHAVIOUR_INSTANT_UPDATE = 'instantUpdate'
const BEHAVIOUR_DELAYED_UPDATE = 'delayedUpdate'
const BEHAVIOUR_UNCONTROLLED = 'uncontrolled'

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

  setInitial({ key, record, getRemoteVersion, uploadRecord, uncontrolledAttributes }) {
    this.recordsWithMetadata.set(key, {
      record,
      localVersion: getRemoteVersion(record),
      getRemoteVersion,
      uploadRecord,
      uploadMutex: new Mutex(),
      uncontrolledAttributes,
      onUpload: () => {},
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

  update(key, delta, { incrementLocalVersion = true } = {}) {
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

    return new Promise(resolve => {
      const oldOnUpload = recordWithMetadata.onUpload

      recordWithMetadata.onUpload = updatedRecord => {
        oldOnUpload(updatedRecord)
        resolve(updatedRecord)
        recordWithMetadata.onUpload = () => {}
      }
    })
  },

  notifySubscribers(key) {
    const record = this.get(key)
    this.subscribers.get(key).forEach(subscriber => subscriber(record))
  },

  recordIsDirty(key) {
    const recordWithMetadata = this.recordsWithMetadata.get(key)
    return recordWithMetadata.localVersion > recordWithMetadata.getRemoteVersion(recordWithMetadata.record)
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

    await withLock(recordWithMetadata.uploadMutex, async () => {
      const uploadingVersion = recordWithMetadata.localVersion
      const updatedRecord = await recordWithMetadata.uploadRecord(recordWithMetadata.record, uploadingVersion)
      recordWithMetadata.onUpload(updatedRecord)
    })
  }
}

const uploadDirtyRecords = ({ waitForLock = false } = {}) => {
  const dirtyRecordKeys = globalDataStore.allRecordKeys().filter(key => globalDataStore.recordIsDirty(key))

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

const useSynchronisedRecord = ({ key, getRemoteVersion, isUpToDate, fetchRecord, uploadRecord, attributeBehaviours = {} }) => {
  const [futureRecord, setFutureRecord] = useState(() => Future.pending())

  const uncontrolledAttributes = useMemo(() => Object.entries(attributeBehaviours)
    .filter(([, behaviour]) => behaviour === BEHAVIOUR_UNCONTROLLED)
    .map(([attribute]) => attribute)
  , [attributeBehaviours])

  useEffect(() => {
    if (globalDataStore.has(key) && isUpToDate(getRemoteVersion(globalDataStore.get(key)))) {
      setFutureRecord(Future.resolved(globalDataStore.get(key)))
    } else {
      fetchRecord(key).then(
        record => globalDataStore.setInitial({ key, record, getRemoteVersion, uploadRecord, uncontrolledAttributes }),
        error => console.error(error) // TODO: handle error
      )
    }

    const subscription = record => setFutureRecord(Future.resolved(record))

    globalDataStore.subscribe(key, subscription)
    return () => globalDataStore.unsubscribe(key, subscription)
  }, [key])

  const updateRecord = delta => {
    let hasInstantUpdateKeys = false

    Object.keys(delta).forEach(key => {
      switch (attributeBehaviours[key] || BEHAVIOUR_INSTANT_UPDATE) {
        case BEHAVIOUR_INSTANT_UPDATE:
          hasInstantUpdateKeys = true
          break

          case BEHAVIOUR_UNCONTROLLED:
            throw new Error(`Cannot update uncontrolled attribute: ${key}`)
      }
    })

    const promise = globalDataStore.update(key, delta)

    if (hasInstantUpdateKeys) {
      globalDataStore.uploadRecord(key, { waitForLock: true })
    }

    return promise.then(updatedRecord => {
      globalDataStore.update(
        key,
        uncontrolledAttributes.reduce((acc, attribute) => ({
          ...acc,
          [attribute]: updatedRecord[attribute],
        }), {}),
        { incrementLocalVersion: false }
      )

      return updatedRecord
    })
  }

  return futureRecord.map(record => [record, updateRecord])
}

export default useSynchronisedRecord

export {
  BEHAVIOUR_INSTANT_UPDATE,
  BEHAVIOUR_DELAYED_UPDATE,
  BEHAVIOUR_UNCONTROLLED,
}
