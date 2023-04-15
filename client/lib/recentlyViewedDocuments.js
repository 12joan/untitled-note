import makeLocalHistory from '~/lib/localHistory';

const { touchItem: documentWasViewed, useItems: useRecentlyViewedDocuments } =
  makeLocalHistory({
    key: 'recentlyViewedDocuments',
  });

export { documentWasViewed, useRecentlyViewedDocuments };
