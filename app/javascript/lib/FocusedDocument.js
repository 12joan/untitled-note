class FocusedDocument {
  constructor() {
    this.value = undefined;
  }

  then(f) {
    const valueOrDefault = document.body.contains(this.value)
      ? this.value
      : document.querySelector('.document-editor') // Default to first document

    return valueOrDefault && f(valueOrDefault)
  }

  set(value) {
    this.value = value
  }
}

export default FocusedDocument
