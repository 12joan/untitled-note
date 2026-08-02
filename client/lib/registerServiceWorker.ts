void (async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/vite/assets',
      });

      // biome-ignore lint/suspicious/noConsole: logging
      console.debug('Registered service worker');
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: logging
      console.error('Failed to register service worker:', error);
    }
  }
})();
