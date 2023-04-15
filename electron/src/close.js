const { app, autoUpdater, BrowserWindow } = require('electron');
const { isMac } = require('./helpers');

let isQuitting = false;
let queuedToClose = [];
let queuedToCloseTimeout = null;
let performingEnqueuedClose = false;

const performEnqueuedClose = () => {
  queuedToCloseTimeout = null;
  performingEnqueuedClose = true;

  const isLastWindowGroup =
    queuedToClose.length === BrowserWindow.getAllWindows().length;
  const focusedWindow = BrowserWindow.getFocusedWindow();

  queuedToClose.forEach((browserWindow) => {
    if (isLastWindowGroup && browserWindow === focusedWindow) {
      if (browserWindow.isFullScreen()) {
        browserWindow.once('leave-full-screen', () => browserWindow.hide());
        browserWindow.setFullScreen(false);
      } else {
        browserWindow.hide();
      }
    } else {
      browserWindow.close();
    }
  });

  performingEnqueuedClose = false;
  queuedToClose = [];
};

// Hide last active window instead of closing (macOS)
const registerWindow = (browserWindow) => {
  browserWindow.on('close', (event) => {
    if (!performingEnqueuedClose && !isQuitting && isMac) {
      event.preventDefault();

      queuedToClose.push(browserWindow);

      if (!queuedToCloseTimeout) {
        queuedToCloseTimeout = setTimeout(performEnqueuedClose, 0);
      }
    }
  });
};

const registerApp = () => {
  // Quit when all windows are closed (except on macOS)
  app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit();
    }
  });

  // Show hidden windows on activate (macOS)
  app.on('activate', () => {
    if (isMac) {
      BrowserWindow.getAllWindows().forEach((browserWindow) => {
        if (!browserWindow.isVisible()) {
          browserWindow.show();
        }
      });
    }
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  autoUpdater.on('before-quit-for-update', () => {
    isQuitting = true;
  });
};

module.exports = {
  registerWindow,
  registerApp,
};
