import { app, Menu } from 'electron';
import { updateElectronApp } from 'update-electron-app';
import contextMenu from 'electron-context-menu';
import { ENV } from './env.js';
import { createMenu } from './menu.js';
import { createWindow } from './window.js';
import * as closeBehaviour from './close.js';

updateElectronApp({
  repo: '12joan/untitled-note-app-releases',
});

contextMenu({
  showSearchWithGoogle: false,
  showSelectAll: false,
  showSaveImage: true,
  showSaveImageAs: true,
  showInspectElement: ENV.devTools,
});

app.whenReady().then(() => {
  createWindow();
  Menu.setApplicationMenu(createMenu());
  closeBehaviour.registerApp(app);
});
