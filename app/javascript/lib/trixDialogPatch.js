import Trix, { handleEvent } from 'trix'
import { Modal as BootstrapModal } from 'bootstrap'

// Adapted from https://github.com/basecamp/trix/blob/main/src/trix/controllers/toolbar_controller.coffee

Trix.ToolbarController.prototype.getDialog = function (dialogName) {
  return document.querySelector(`#trix-dialogs [data-trix-dialog=${dialogName}]`)
}

Trix.ToolbarController.prototype.dialogIsVisible = function (dialogName) {
  const element = this.getDialog(dialogName)
  return (element !== null) && element.classList.contains('show')
}

Trix.ToolbarController.prototype.showDialog = function (dialogName) {
  this.hideDialog()
  this.delegate?.toolbarWillShowDialog()

  const element = this.getDialog(dialogName)
  element.setAttribute('data-trix-active', '')
  element.classList.add('trix-active')

  BootstrapModal.getInstance(element).show()

  element.querySelectorAll('input[disabled]').forEach(disabledInput => {
    disabledInput.removeAttribute('disabled')
  })

  const attributeName = this.getAttributeName(element)

  if (attributeName !== undefined && attributeName !== null) {
    const input = this.getInputForDialog(element, dialogName)

    if (input !== undefined && input !== null) {
      input.value = this.attributes[attributeName] || ''
    }
  }

  this.delegate?.toolbarDidShowDialog(dialogName)

  this._shouldRespondToEvents = true

  if (this._addedEventListeners === undefined) {
    handleEvent('click', {
      onElement: element,
      matchingSelector: '[data-trix-dialog] [data-trix-method]',
      withCallback: (...args) => this._shouldRespondToEvents && this.didClickDialogButton(...args),
    })

    handleEvent('keydown', {
      onElement: element,
      matchingSelector: '[data-trix-dialog] [data-trix-input]',
      withCallback: (...args) => this._shouldRespondToEvents && this.didKeyDownDialogInput(...args),
    })

    element.addEventListener('hidden.bs.modal', this.hideDialog.bind(this))

    this._addedEventListeners = true
  }
}

Trix.ToolbarController.prototype.hideDialog = function () {
  const element = document.querySelector('#trix-dialogs [data-trix-dialog][data-trix-active]')

  if (element !== undefined && element !== null) {
    BootstrapModal.getInstance(element).hide()

    this._shouldRespondToEvents = false

    element.removeAttribute('data-trix-active')
    element.classList.remove('trix-active')
    this.resetDialogInputs()
    this.delegate?.toolbarDidHideDialog(this.getDialogName(element))
  }
}

Trix.ToolbarController.prototype.resetDialogInputs = function () {
  document.querySelectorAll('#trix-dialogs [data-trix-dialog] [data-trix-input]').forEach(input => {
    input.setAttribute('disabled', 'disabled')
    input.removeAttribute('data-trix-validate')
    input.classList.remove('trix-validate')
  })
}

Trix.ToolbarController.prototype.getAttributeName = function (element) {
  return element.getAttribute('data-trix-attribute') || element.getAttribute('data-trix-dialog-attribute')
}

Trix.ToolbarController.prototype.getInputForDialog = function (element, attributeName) {
  return element.querySelector(`[data-trix-input][name='${attributeName || this.getAttributeName(element)}']`)
}

Trix.ToolbarController.prototype.getDialogName = function (element) {
  return element.getAttribute('data-trix-dialog')
}
