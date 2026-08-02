import { app, Menu } from 'electron';
import contextMenu from 'electron-context-menu';
import { updateElectronApp } from 'update-electron-app';
import * as closeBehaviour from './close.js';
import { ENV } from './env.js';
import { createMenu } from './menu.js';
import { createWindow } from './window.js';

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
  void createWindow();
  Menu.setApplicationMenu(createMenu());
  closeBehaviour.registerApp(app);
});
