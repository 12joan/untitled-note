import { useState, useEffect } from 'react'

const useSynchronisedRecord = ({ initialRecord, synchroniseRecord }) => {
  const [record, setRecord] = useState(initialRecord)

  const [localVersion, setLocalVersion] = useState(0)
  const [remoteVersion, setRemoteVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [updatePromiseCallbacks, setUpdatePromiseCallbacks] = useState([])

  useEffect(() => {
    if (localVersion > remoteVersion && !isUploading) {
      setIsUploading(true)
      const uploadingVersion = localVersion

      const callbacks = updatePromiseCallbacks.filter(({ version }) => uploadingVersion >= version)

      synchroniseRecord(record)
        .then(updatedRecord => callbacks.forEach(callback => callback.resolve({
          localRecord: record,
          remoteRecord: updatedRecord,
        })))
        .catch(error => {
          console.error(error)
          callbacks.forEach(callback => callback.reject(error))
        })
        .then(() => {
          setRemoteVersion(uploadingVersion)
          setIsUploading(false)
        })
    }
  }, [localVersion, remoteVersion, isUploading])

  const updateRecord = (params, incrementLocalVersion = true) => {
    setRecord(record => ({
      ...record,
      ...params,
    }))

    if (incrementLocalVersion) {
      setLocalVersion(localVersion => localVersion + 1)

      return new Promise((resolve, reject) => {
        setUpdatePromiseCallbacks(callbacks => [
          ...callbacks,
          { version: localVersion, resolve, reject },
        ])
      })
    }
  }

  return [record, updateRecord]
}

export default useSynchronisedRecord
