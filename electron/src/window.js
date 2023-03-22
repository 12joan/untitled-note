const { BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const { isMac } = require('./helpers')
const { ENV } = require('./env')
const closeBehaviour = require('./close')
const navigationBehaviour = require('./navigation')

const tabsSupported = isMac

const userAgent = [
  'Electron',
  tabsSupported ? 'TabsSupported' : 'TabsNotSupported',
  'FindSupported',
  // Required by Slate
  'Chrome',
  isMac && 'Mac OS X',
].filter(Boolean).join(' ')

const getBackgroundColor = () => nativeTheme.shouldUseDarkColors
  ? '#0f172b'
  : '#ffffff'

const getWindowSettings = () => ({
  width: 1200,
  height: 800,
  minWidth: 320,
  minHeight: 360,
  show: false,
  tabbingIdentifier: 'untitled-note',
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    devTools: ENV.devTools,
    scrollBounce: true,
    spellcheck: true,
  },
  backgroundColor: getBackgroundColor(),
  icon: path.resolve(__dirname, '../icons/app-icon.png'),
})

const showErrorPage = (browserWindow) => browserWindow.loadFile(
  path.join(__dirname, '../pages/error.html'),
)

const loadApp = async (browserWindow, url) => {
  await browserWindow.loadFile(
    path.join(__dirname, '../dist/loading.html')
  )

  await browserWindow.loadURL(url, { userAgent }).catch(() => showErrorPage(browserWindow))
}

const createWindow = async ({
  url = `${ENV.app.protocol}://${ENV.app.host}`,
  parentWindow = null,
} = {}) => {
  const browserWindow = new BrowserWindow(getWindowSettings())
  const { webContents } = browserWindow

  // Create new tab if parent window is set
  if (tabsSupported) {
    parentWindow?.addTabbedWindow(browserWindow)
  }

  // Handle new tab button
  browserWindow.on('new-window-for-tab', (event) => {
    createWindow({ parentWindow: browserWindow })
  })

  // Register close behaviour prior to load
  closeBehaviour.registerWindow(browserWindow)

  // Show error page if the app fails to load
  webContents.on('did-fail-load', () => showErrorPage(browserWindow))

  // Reload app via IPC
  ipcMain.on('reload-app', loadApp)

  // Prevent flash of white screen
  browserWindow.once('ready-to-show', () => browserWindow.show())

  await loadApp(browserWindow, url)

  // Ensure background color matches theme to prevent flicker
  nativeTheme.on('updated', () => {
    if (!browserWindow.isDestroyed()) {
      browserWindow.setBackgroundColor(getBackgroundColor())
    }
  })

  // Load navigation behaviour last
  navigationBehaviour.registerWindow(browserWindow, { createWindow })
}

module.exports = {
  createWindow,
}
