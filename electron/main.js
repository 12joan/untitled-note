const {
  app,
  BrowserWindow,
  Menu,
  shell,
} = require('electron')
const createMenu = require('./menu')
const path = require('path')

const INTERNAL_URL_HOSTS = [
  'localhost',
  // 'untitlednote.eu.auth0.com',
]

const linkIsExternal = url => !INTERNAL_URL_HOSTS.some(host => new URL(url).host === host)

const createWindow = async () => {
  const browserWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 320,
    minHeight: 360,
    show: false,
  })

  // Show error page if the app fails to load
  const showErrorPage = () => browserWindow.loadFile('error.html')
  browserWindow.webContents.on('did-fail-load', showErrorPage)

  // Prevent flash of white screen
  browserWindow.once('ready-to-show', () => browserWindow.show())

  await browserWindow.loadFile('loading.html')

  await browserWindow.loadURL('http://localhost:3000/').catch(showErrorPage)

  // Open external links in the default browser
  browserWindow.webContents.on('will-navigate', (event, url) => {
    if (linkIsExternal(url)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (linkIsExternal(url)) {
      shell.openExternal(url)
      return { action: 'deny' }
    }

    return { action: 'allow' }
  })

  return browserWindow
}

// Register untitlednote:// protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(
      'untitlednote',
      process.execPath,
      [path.resolve(process.argv[1])]
    )
  }
} else {
  app.setAsDefaultProtocolClient('untitlednote')
}

const gotTheLock = app.requestSingleInstanceLock()

let mainWindow

const setMainWindow = win => {
  mainWindow = win
}

if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    createWindow().then(setMainWindow)

    Menu.setApplicationMenu(createMenu())

    // Ensure window is open on activate (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().then(setMainWindow)
      }
    })

    // Quit when all windows are closed (except on macOS)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('second-instance', (event, commandLine, workingDirectory) => {
      dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
    })

    app.on('open-url', (event, url) => {
      dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
    })
  })
}
