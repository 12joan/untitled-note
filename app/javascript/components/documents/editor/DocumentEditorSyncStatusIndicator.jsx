import React from 'react'
import { Check as Check } from 'react-bootstrap-icons'

const DocumentEditorSyncStatusIndicator = props => {
  const toolbarCollapseId = `${props.toolbarId}-collapse`

  const spinner = (
    <div style={{ transform: 'scale(0.8)' }}>
      <span className="spinner-border spinner-border-sm text-white" />
    </div>
  )

  const { className, label, icon, urgent = false } = {
    'upToDate': {
      className: 'bg-success text-white',
      label: 'Up to date',
      icon: (
        <Check className="bi" style={{ transform: 'scale(1.4)' }} />
      ),
    },

    'dirty': {
      className: 'bg-success text-white',
      label: 'Uploading changes',
      icon: spinner,
    },

    'failed': {
      className: 'bg-danger text-white',
      label: 'Unable to save changes',
      urgent: true,
      icon: spinner,
    },
  }[props.syncStatus]

  return (
    <div
      className={`rounded-circle text-center ${className}`}
      style={{ width: '1.5em', height: '1.5em' }}
      title={label}>
      {icon}
      <span
        className="visually-hidden"
        aria-live={urgent ? 'assertive' : false}>
        {label}
      </span>
    </div>
  )
}

export default DocumentEditorSyncStatusIndicator
