const { Menu } = require('electron')
const { setZoomFactor } = require('./helpers')

module.exports = options => {
  const isMac = process.platform === 'darwin'

  const appMenu = {
    label: 'Untitled Note App',
    submenu: [
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },
      {
        label: `Hide Untitled Note App`,
        accelerator: 'Cmd+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Cmd+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: 'Quit Untitled Note App',
        accelerator: 'Cmd+Q',
        role: 'quit',
      },
    ],
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  }

  // back, forward, reload, toggle fullscreen, zoom, toggle dev tools
  const viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+[',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.goBack()
          }
        },
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+]',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.goForward()
          }
        },
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.reload()
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Toggle Full Screen',
        accelerator: isMac ? 'Ctrl+Command+F' : 'F11',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        },
      },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+=',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            setZoomFactor(focusedWindow, zoomFactor => zoomFactor + 0.1)
          }
        },
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            setZoomFactor(focusedWindow, zoomFactor => zoomFactor - 0.1)
          }
        },
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            setZoomFactor(focusedWindow, 1)
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Toggle Developer Tools',
        accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        },
      },
    ],
  }

  const windowMenu = {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  }

  const helpMenu = {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => {
          // TODO: open help page
        },
      },
    ],
  }

  return Menu.buildFromTemplate([
    ...(isMac ? [appMenu] : []),
    editMenu,
    viewMenu,
    windowMenu,
    helpMenu,
  ])
}
