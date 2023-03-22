const { app, Menu } = require('electron')
const updateElectronApp = require('update-electron-app')
const contextMenu = require('electron-context-menu')
const { ENV } = require('./env')
const createMenu = require('./menu')
const { createWindow } = require('./window')
const closeBehaviour = require('./close')

updateElectronApp({
  repo: '12joan/untitled-note-app-releases',
})

contextMenu({
  showSearchWithGoogle: false,
  showSelectAll: false,
  showSaveImage: true,
  showSaveImageAs: true,
  showInspectElement: ENV.devTools,
})

app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(createMenu())
  closeBehaviour.registerApp(app)
})
