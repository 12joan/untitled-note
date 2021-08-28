import React from 'react'

import {
  TypeBold as Bold,
  TypeItalic as Italic,
  TypeStrikethrough as Strikethrough,
  Link45deg as Link,
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
    <div className="trix-toolbar" id={props.toolbarId}>
      <div className="collapse" id={props.toolbarCollapseId}>
        <ButtonGroup>
          <ToolbarButton shortcut="b" attribute="bold" title="Bold" icon={Bold} />
          <ToolbarButton shortcut="i" attribute="italic" title="Italic" icon={Italic} />
          <ToolbarButton attribute="strike" title="Strikethrough" icon={Strikethrough} />
          <ToolbarButton shortcut="k" attribute="href" action="link" title="Link" icon={Link} />
        </ButtonGroup>

        <ButtonGroup>
          <ToolbarButton shortcut="1" attribute="heading1" title="Heading" icon={Heading} />
          <ToolbarButton attribute="quote" title="Quote" icon={Quote} />
          <ToolbarButton attribute="code" title="Code" icon={Code} />
          <ToolbarButton attribute="bullet" title="Bulleted List" icon={BulletedList} />
          <ToolbarButton attribute="number" title="Numbered List" icon={NumberedList} />
          <ToolbarButton action="decreaseNestingLevel" title="Decrease Level" icon={Outdent} />
          <ToolbarButton action="increaseNestingLevel" title="Increase Level" icon={Indent} />
        </ButtonGroup>

        <ButtonGroup>
          <ToolbarButton action="attachFiles" title="Attach Files" icon={Attachment} />
        </ButtonGroup>

        <ButtonGroup>
          <ToolbarButton shortcut="z" action="undo" title="Undo" icon={Undo} />
          <ToolbarButton shortcut="shift+z" action="redo" title="Redo" icon={Redo} />
        </ButtonGroup>
      </div>

      <Dialogs />
    </div>
  )
}

const ButtonGroup = props => {
  return (
    <div className="btn-group me-3">
      {props.children}
    </div>
  )
}

const ToolbarButton = props => {
  const IconComponent = props.icon

  return (
    <button
      type="button"
      className="btn btn-toolbar"
      data-trix-attribute={props.attribute}
      data-trix-action={props.action}
      data-trix-key={props.shortcut}
      title={props.title}>
      <IconComponent className="bi" />
      <span className="visually-hidden">{props.title}</span>
    </button>
  )
}

const Dialogs = props => {
  return (
    <div className="trix-dialogs" data-trix-dialogs="">
      <div className="trix-dialog" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div className="d-md-flex mb-n3">
          <input
            type="url"
            name="href"
            className="form-control me-3 mb-3"
            placeholder="Enter a URL…"
            aria-label="URL"
            required
            data-trix-input="" />

          <div className="btn-group mb-3">
            <button type="button" className="btn btn-light" data-trix-method="setAttribute">Link</button>
            <button type="button" className="btn btn-light" data-trix-method="removeAttribute">Unlink</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditorToolbar
