import React from 'react'

import {
  TypeBold as Bold,
  TypeItalic as Italic,
  TypeStrikethrough as Strikethrough,
  Link45deg as Link,
  Book,
  TypeH1 as Heading,
  BlockquoteLeft as Quote,
  Code as Code,
  ListUl as BulletedList,
  ListOl as NumberedList,
  TextIndentLeft as Indent,
  TextIndentRight as Outdent,
  Paperclip as Attachment,
  ArrowCounterclockwise as Undo,
  ArrowClockwise as Redo,
} from 'react-bootstrap-icons'

const DocumentEditorToolbar = props => {
  return (
    <div className="layout-row trix-toolbar overflow-auto p-2 pe-0" id={props.toolbarId}>
        <ToolbarButton shortcut="b" attribute="bold" title="Bold" icon={Bold} />
        <ToolbarButton shortcut="i" attribute="italic" title="Italic" icon={Italic} />
        <ToolbarButton attribute="strike" title="Strikethrough" icon={Strikethrough} />
        <ToolbarButton shortcut="k" attribute="href" action="link" title="Link" icon={Link} />

        <ToolbarButton shortcut="1" attribute="heading1" title="Heading" icon={Heading} />
        <ToolbarButton attribute="quote" title="Quote" icon={Quote} />
        <ToolbarButton attribute="code" title="Code" icon={Code} />
        <ToolbarButton attribute="bullet" title="Bulleted List" icon={BulletedList} />
        <ToolbarButton attribute="number" title="Numbered List" icon={NumberedList} />
        <ToolbarButton action="decreaseNestingLevel" title="Decrease Level" icon={Outdent} />
        <ToolbarButton action="increaseNestingLevel" title="Increase Level" icon={Indent} />

        <ToolbarButton action="attachFiles" title="Attach Files" icon={Attachment} />
        <ToolbarButton attribute="definitiveMention" title="Definitive Mention" icon={Book} />

        <ToolbarButton shortcut="z" action="undo" title="Undo" icon={Undo} />
        <ToolbarButton shortcut="shift+z" action="redo" title="Redo" icon={Redo} />
    </div>
  )
}

const ButtonGroup = props => {
  return (
    <div className="x-btn-group d-inline-flex me-2">
      {props.children}
    </div>
  )
}

const ToolbarButton = props => {
  const onKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.target.dispatchEvent(new MouseEvent('mousedown', {
        'bubbles': true,
        'cancelable': true,
      }))

      event.preventDefault()
      event.stopPropagation()
    }
  }

  const IconComponent = props.icon

  return (
    <button
      type="button"
      className="btn btn-toolbar rounded-pill fs-5 px-2 py-1 me-1"
      onKeyDown={onKeyDown}
      data-trix-attribute={props.attribute}
      data-trix-action={props.action}
      data-trix-key={props.shortcut}
      title={props.title}>
      <IconComponent className="bi" />
      <span className="visually-hidden">{props.title}</span>
    </button>
  )
}

export default DocumentEditorToolbar
