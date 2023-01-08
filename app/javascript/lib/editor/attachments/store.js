const uploadsInProgress = {}

export default {
  registerUploadInProgress: (id, data) => uploadsInProgress[id] = data,
  removeUploadInProgress: id => delete uploadsInProgress[id],
  uploadIsInProgress: id => Boolean(uploadsInProgress[id]),
  forEachUploadInProgress: callback => Object.entries(uploadsInProgress).forEach(callback),
}
