const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  shell,
} = require('electron')
const path = require('path')
const createMenu = require('./menu')
const { isDevelopment, isMac } = require('./helpers')
const { ENV } = require('./env')

const INTERNAL_URL_HOSTS = [
  ENV.app.host,
  'untitlednote.eu.auth0.com',
]

const linkIsNavigable = url => new URL(url).protocol !== 'file:'
const linkIsExternal = url => !INTERNAL_URL_HOSTS.some(host => new URL(url).host === host)

const tabsSupported = isMac

let isQuitting = false

const userAgent = [
  'Electron',
  tabsSupported ? 'TabsSupported' : 'TabsNotSupported',
  'FindSupported',
].join(' ')

const createWindow = async ({
  url = `${ENV.app.protocol}://${ENV.app.host}`,
  parentWindow = null,
} = {}) => {
  const browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 320,
    minHeight: 360,
    show: false,
    tabbingIdentifier: 'untitled-note',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Create new tab if parent window is set
  if (tabsSupported) {
    parentWindow?.addTabbedWindow(browserWindow)
  }

  const { webContents } = browserWindow

  // Show error page if the app fails to load
  const showErrorPage = () => browserWindow.loadFile('error.html')
  webContents.on('did-fail-load', showErrorPage)

  // Prevent flash of white screen
  browserWindow.once('ready-to-show', () => browserWindow.show())

  await browserWindow.loadFile('loading.html')

  await browserWindow.loadURL(url, { userAgent }).catch(showErrorPage)

  // Open external links in the default browser
  webContents.on('will-navigate', (event, url) => {
    if (!linkIsNavigable(url)) {
      console.warn('Blocked navigation to', url)
      event.preventDefault()
    } else if (linkIsExternal(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  webContents.setWindowOpenHandler(({ url }) => {
    if (!linkIsNavigable(url)) {
      console.warn('Blocked navigation to', url)
    } else if (linkIsExternal(url)) {
      shell.openExternal(url)
    } else {
      createWindow({ url, parentWindow: browserWindow })
    }

    return { action: 'deny' }
  })

  // Handle new tab button
  browserWindow.on('new-window-for-tab', (event) => {
    createWindow({ parentWindow: browserWindow })
  })

  // Hide last window instead of closing (macOS)
  browserWindow.on('close', (event) => {
    if (!isQuitting && isMac && BrowserWindow.getAllWindows().length === 1) {
      event.preventDefault()
      browserWindow.hide()
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  Menu.setApplicationMenu(createMenu())

  // Show hidden windows on activate (macOS)
  app.on('activate', () => {
    if (isMac) {
      BrowserWindow.getAllWindows().forEach((window) => {
        if (!window.isVisible()) {
          window.show()
        }
      })
    }
  })

  // Quit when all windows are closed (except on macOS)
  app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })

  app.on('before-quit', () => {
    isQuitting = true
  })
})
