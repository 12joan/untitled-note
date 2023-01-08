import React from 'react'

import groupedClassNames from '~/lib/groupedClassNames'

const ImageAttachment = ({ s3File, selectedClassNames }) => {
  const className = groupedClassNames(selectedClassNames, {
    rounded: 'rounded-lg',
    margin: 'mx-auto',
    ringOffset: 'ring-offset-2',
  })

  const { url, filename } = s3File

  return (
    <img src={url} alt={filename} className={className} />
  )
}

export default ImageAttachment
