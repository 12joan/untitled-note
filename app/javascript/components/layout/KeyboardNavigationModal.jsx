import React from 'react'

import modifierKey from '~/lib/modifierKey'

import Modal from '~/components/Modal'

const KeyboardNavigationModal = props => {
  const meta = key => ({
    symbol: `${modifierKey.symbol}${key}`,
    label: `${modifierKey.label}+${key}`,
  })

  const shift = key => ({
    symbol: `⇧${key}`,
    label: `shift+${key}`,
  })

  return (
    <Modal
      id="keyboard-navigation-modal"
      title="Keyboard Navigation"
      modalDialogProps={{ className: 'modal-dialog modal-dialog-centered modal-xl' }}>
      <div className="row row-cols-1 row-cols-lg-2">
        <div className="col mt-3">
          <h2 className="h5">Document Shortcuts</h2>

          <ShortcutsTable
            config={[
              { shortcut: 'T', description: 'Select title' },
              { shortcut: 'K', description: 'Select keyword field' },
              { shortcut: 'I', description: 'Focus body' },
              { shortcut: 'M', description: 'Focus document menu button' },
            ]} />
        </div>

        <div className="col mt-3">
          <h2 className="h5">Text Formatting Shortcuts</h2>

          <ShortcutsTable
            config={[
              { shortcut: meta('B'), description: 'Bold' },
              { shortcut: meta('I'), description: 'Italic' },
              { shortcut: meta('K'), description: 'Link' },
              { shortcut: meta('1'), description: 'Heading' },
            ]} />
        </div>

        <div className="col mt-3">
          <h2 className="h5">Navigation Shortcuts</h2>

          <ShortcutsTable
            config={[
              { shortcut: { symbol: 'Esc', label: 'Escape' }, description: 'Defocus the current input' },
              { shortcut: { symbol: '⌫', label: 'Backspace' }, description: 'Go back to the parent view' },
              { shortcut: 'N', description: 'Create a new document' },
              { shortcut: 'A', description: 'Show All Documents' },
              { shortcut: 'P', description: 'Show Projects' },
              { shortcut: 'G', description: 'Search' },
              { shortcut: 'S', description: 'Toggle sidebar' },
              { shortcut: '?', description: 'Show keyboard navigation help' },
            ]} />
        </div>

        <div className="col mt-3">
          <h2 className="h5">Focus Shortcuts</h2>

          <ShortcutsTable
            config={[
              { shortcut: shift('D'), description: 'Focus documents' },
              { shortcut: shift('T'), description: 'Focus top bar' },
              { shortcut: shift('N'), description: 'Focus navigation menu' },
              { shortcut: shift('P'), description: 'Focus Pinned Documents section of navigation menu' },
              { shortcut: shift('K'), description: 'Focus Keywords section of navigation menu' },
            ]} />
        </div>
      </div>
    </Modal>
  )
}

const ShortcutsTable = props => {
  return (
    <table className="table table-borderless align-middle w-auto">
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
  return (
    <tr>
      <td className="pe-0">
        <ShortcutKey config={props.shortcut} />
      </td>

      <td>{props.description}</td>
    </tr>
  )
}

const ShortcutKey = props => {
  const { symbol, label } = typeof props.config === 'string' ? { symbol: props.config } : props.config

  return (
    <kbd
      title={label}
      aria-label={label}
      className="text-center border-0 bg-dark text-white px-2 py-1"
      style={{ minWidth: '3em' }}>
      {symbol}
    </kbd>
  )
}

export default KeyboardNavigationModal
