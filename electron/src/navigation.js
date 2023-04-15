const { shell } = require('electron');
const { ENV } = require('./env');

const INTERNAL_URL_HOSTS = [ENV.app.host, 'untitlednote.eu.auth0.com'];

const linkIsNavigable = (url) => new URL(url).protocol !== 'file:';
const linkIsExternal = (url) =>
  !INTERNAL_URL_HOSTS.some((host) => new URL(url).host === host);

const registerWindow = (browserWindow, { createWindow }) => {
  const { webContents } = browserWindow;

  // Open external links in the default browser
  webContents.on('will-navigate', (event, url) => {
    if (!linkIsNavigable(url)) {
      // eslint-disable-next-line no-console
      console.warn('Blocked navigation to', url);
      event.preventDefault();
    } else if (linkIsExternal(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  webContents.setWindowOpenHandler(({ url }) => {
    if (!linkIsNavigable(url)) {
      // eslint-disable-next-line no-console
      console.warn('Blocked navigation to', url);
    } else if (linkIsExternal(url)) {
      shell.openExternal(url);
    } else {
      createWindow({ url, parentWindow: browserWindow });
    }

    return { action: 'deny' };
  });
};

module.exports = {
  registerWindow,
};
