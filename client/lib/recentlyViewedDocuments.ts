import { makeLocalHistory } from '~/lib/localHistory';

const {
  touchItem: documentWasViewed,
  useItems: useRecentlyViewedDocuments,
} = makeLocalHistory<number>({
  key: 'recentlyViewedDocuments',
});

export { documentWasViewed, useRecentlyViewedDocuments };
