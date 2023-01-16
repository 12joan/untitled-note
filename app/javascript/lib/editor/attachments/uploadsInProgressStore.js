const uploadsInProgress = {}

export default {
  register: (id, data) => uploadsInProgress[id] = data,
  remove: id => delete uploadsInProgress[id],
  isInProgress: id => Boolean(uploadsInProgress[id]),
  forEach: callback => Object.entries(uploadsInProgress).forEach(callback),
}
