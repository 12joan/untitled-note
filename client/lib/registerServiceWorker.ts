(async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/vite/assets',
      });

      // eslint-disable-next-line no-console
      console.debug('Registered service worker');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to register service worker:', error);
    }
  }
})();
