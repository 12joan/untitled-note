const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  reloadApp: () => ipcRenderer.send('reload-app'),
  onNavigate: callback => ipcRenderer.on('navigate', callback),
})
