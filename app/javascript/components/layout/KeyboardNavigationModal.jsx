import React from 'react'

import Modal from 'components/Modal'

const KeyboardNavigationModal = props => {
  const meta = key => [
    `ctrl+${key}`,
    { icon: `⌘${key}`, label: `command+${key}` },
  ]

  return (
    <Modal
      id="keyboard-navigation-modal"
      title="Keyboard Navigation">

      <h2 className="h3">Document Shortcuts</h2>

      <ShortcutsTable
        config={[
          { keys: 'T', description: 'Select title' },
          { keys: 'K', description: 'Select keyword field' },
          { keys: 'I', description: 'Focus body' },
          { keys: 'M', description: 'Focus document menu button' },
          { keys: 'F', description: 'Focus formatting controls button' },
        ]} />

      <h2 className="h3">Text Formatting Shortcuts</h2>

      <ShortcutsTable
        config={[
          { keys: meta('B'), description: 'Bold' },
          { keys: meta('I'), description: 'Italic' },
          { keys: meta('K'), description: 'Link' },
          { keys: meta('1'), description: 'Heading' },
        ]} />

      <h2 className="h3">General Shortcuts</h2>

      <ShortcutsTable
        config={[
          { keys: 'Escape', description: 'Defocus the current input' },
          { keys: 'Backspace', description: 'Go back to the parent view' },
          { keys: 'N', description: 'Create a new document' },
          { keys: 'A', description: 'Show All Documents' },
          { keys: 'P', description: 'Show Projects' },
          { keys: 'S', description: 'Toggle sidebar' },
          { keys: 'shift+D', description: 'Focus documents' },
          { keys: 'shift+T', description: 'Focus top bar' },
          { keys: 'shift+N', description: 'Focus navigation menu' },
          { keys: 'shift+P', description: 'Focus Pinned Documents section of navigation menu' },
          { keys: 'shift+K', description: 'Focus Keywords section of navigation menu' },
          { keys: 'shift+?', description: 'Show keyboard navigation help' },
        ]} />

    </Modal>
  )
}

const ShortcutsTable = props => {
  return (
    <table className="table table-borderless w-auto">
      <tbody>
        {
          props.config.map((rowConfig, i) => (
            <ShortcutRow key={i} {...rowConfig} />
          ))
        }
      </tbody>
    </table>
  )
}

const ShortcutRow = props => {
  const keys = Array.isArray(props.keys) ? props.keys : [props.keys]

  return (
    <tr>
      <td>
        {
          keys.map((keyConfig, i) => (
            <ShortcutKey key={i} config={keyConfig} />
          )).reduce((a, b) => [a, ' / ', b])
        }
      </td>

      <td>{props.description}</td>
    </tr>
  )
}

const ShortcutKey = props => {
  const { icon, label } = typeof props.config === 'string' ? { icon: props.config } : props.config

  return (
    <kbd title={label} aria-label={label}>{icon}</kbd>
  )
}

export default KeyboardNavigationModal
