const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  onNavigate: callback => ipcRenderer.on('navigate', callback)
})
