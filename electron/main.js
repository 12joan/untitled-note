const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  shell,
} = require('electron')
const createMenu = require('./menu')
const path = require('path')

const INTERNAL_URL_HOSTS = [
  'localhost:3000',
  'untitlednote.eu.auth0.com',
]

const linkIsNavigable = url => new URL(url).protocol !== 'file:'
const linkIsExternal = url => !INTERNAL_URL_HOSTS.some(host => new URL(url).host === host)

const createWindow = async (url = 'http://localhost:3000/') => {
  const browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 320,
    minHeight: 360,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const { webContents } = browserWindow

  // Show error page if the app fails to load
  const showErrorPage = () => browserWindow.loadFile('error.html')
  webContents.on('did-fail-load', showErrorPage)

  // Prevent flash of white screen
  browserWindow.once('ready-to-show', () => browserWindow.show())

  await browserWindow.loadFile('loading.html')

  await browserWindow.loadURL(url, {
    userAgent: 'Electron',
  }).catch(showErrorPage)

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
      createWindow(url)
    }

    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()

  Menu.setApplicationMenu(createMenu())

  // Ensure window is open on activate (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Quit when all windows are closed (except on macOS)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})
