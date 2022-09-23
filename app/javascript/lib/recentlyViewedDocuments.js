import makeLocalHistory from '~/lib/localHistory'

const [documentWasViewed, useRecentlyViewedDocuments] = makeLocalHistory({
  key: 'recentlyViewedDocuments',
})

export { documentWasViewed, useRecentlyViewedDocuments }
