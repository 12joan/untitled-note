const { app } = require('electron')

const isDevelopment = !!app.isPackaged
const isMac = process.platform === 'darwin'

const clamp = (min, max, value) => Math.min(Math.max(min, value), max)

const setZoomFactor = (focusedWindow, valueOrFunction) => {
  const { zoomFactor } = focusedWindow.webContents

  const newZoomFactor = typeof valueOrFunction === 'function'
    ? valueOrFunction(zoomFactor)
    : valueOrFunction

  const clampedZoomFactor = clamp(0.3, 5, newZoomFactor)
  focusedWindow.webContents.zoomFactor = clampedZoomFactor

  return clampedZoomFactor
}

module.exports = {
  isDevelopment,
  isMac,
  setZoomFactor,
}
