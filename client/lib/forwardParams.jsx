import React from 'react'
import { useParams } from 'react-router-dom'

const ForwardParams = ({ func }) => {
  const params = useParams()
  return func(params)
}

const forwardParams = func => <ForwardParams func={func} />

export default forwardParams
