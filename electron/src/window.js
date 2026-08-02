import path from 'node:path';
import { BrowserWindow, ipcMain, nativeTheme } from 'electron';
import * as closeBehaviour from './close.js';
import { ENV } from './env.js';
import { isMac, tabsSupported } from './helpers.js';
import * as navigationBehaviour from './navigation.js';

const userAgent = [
  'Electron',
  tabsSupported ? 'TabsSupported' : 'TabsNotSupported',
  'FindSupported',
  // Required by Slate
  'Chrome',
  isMac && 'Mac OS X',
]
  .filter(Boolean)
  .join(' ');

const getBackgroundColor = () =>
  nativeTheme.shouldUseDarkColors ? '#0f172b' : '#ffffff';

const getWindowSettings = () => ({
  width: 1200,
  height: 800,
  minWidth: 320,
  minHeight: 360,
  show: false,
  tabbingIdentifier: 'untitled-note',
  webPreferences: {
    preload: path.join(import.meta.dirname, 'preload.cjs'),
    devTools: ENV.devTools,
    scrollBounce: true,
    spellcheck: true,
  },
  backgroundColor: getBackgroundColor(),
  icon: path.resolve(import.meta.dirname, '../icons/app-icon.png'),
});

const showErrorPage = (browserWindow) =>
  browserWindow.loadFile(path.join(import.meta.dirname, '../dist/error.html'));

const loadApp = async (browserWindow, url) => {
  await browserWindow.loadFile(
    path.join(import.meta.dirname, '../dist/loading.html')
  );

  /**
   * Since Electron 40, calling loadURL immediately after loadFile causes loadURL to fail with
   * ERR_ABORTED.
   */
  await new Promise((r) => setTimeout(r));

  await browserWindow
    .loadURL(url, { userAgent })
    .catch(() => showErrorPage(browserWindow));
};

export const createWindow = async ({
  url = `${ENV.app.protocol}://${ENV.app.host}`,
  parentWindow = null,
} = {}) => {
  const browserWindow = new BrowserWindow(getWindowSettings());
  const { webContents } = browserWindow;

  // Create new tab if parent window is set
  if (tabsSupported) {
    parentWindow?.addTabbedWindow(browserWindow);
  }

  // Handle new tab button
  browserWindow.on('new-window-for-tab', () => {
    void createWindow({ parentWindow: browserWindow });
  });

  // Register close behaviour prior to load
  closeBehaviour.registerWindow(browserWindow);

  // Show error page if the app fails to load
  webContents.on('did-fail-load', () => showErrorPage(browserWindow));

  // Reload app via IPC
  ipcMain.on('reload-app', () => loadApp(browserWindow, url));

  // Prevent flash of white screen
  browserWindow.once('ready-to-show', () => browserWindow.show());

  await loadApp(browserWindow, url);

  // Ensure background color matches theme to prevent flicker
  nativeTheme.on('updated', () => {
    if (!browserWindow.isDestroyed()) {
      browserWindow.setBackgroundColor(getBackgroundColor());
    }
  });

  // Load navigation behaviour last
  navigationBehaviour.registerWindow(browserWindow, { createWindow });
};
