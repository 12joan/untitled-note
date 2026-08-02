import { Menu, shell } from 'electron';
import { ENV } from './env.js';
import { isMac, setZoomFactor, tabsSupported } from './helpers.js';

const withFocusedWindow = (handler) => (item, focusedWindow) => {
  if (focusedWindow) {
    handler(focusedWindow, item);
  }
};

export const createMenu = () => {
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
        label: 'Hide Untitled Note App',
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
  };

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
  };

  // back, forward, reload, toggle fullscreen, zoom, toggle dev tools
  const viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'Back',
        accelerator: 'CmdOrCtrl+[',
        click: withFocusedWindow((focusedWindow) =>
          focusedWindow.webContents.send('navigate', -1)
        ),
      },
      {
        label: 'Forward',
        accelerator: 'CmdOrCtrl+]',
        click: withFocusedWindow((focusedWindow) =>
          focusedWindow.webContents.send('navigate', 1)
        ),
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (_item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Toggle Full Scream',
        accelerator: isMac ? 'Ctrl+Command+F' : 'F11',
        click: withFocusedWindow((focusedWindow) =>
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        ),
      },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+=',
        click: withFocusedWindow((focusedWindow) =>
          setZoomFactor(focusedWindow, (zoomFactor) => zoomFactor + 0.1)
        ),
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click: withFocusedWindow((focusedWindow) =>
          setZoomFactor(focusedWindow, (zoomFactor) => zoomFactor - 0.1)
        ),
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click: withFocusedWindow((focusedWindow) =>
          setZoomFactor(focusedWindow, 1)
        ),
      },
      { type: 'separator' },
      ENV.devTools && {
        label: 'Toggle Developer Tools',
        accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click: withFocusedWindow((focusedWindow) =>
          focusedWindow.toggleDevTools()
        ),
      },
    ].filter(Boolean),
  };

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
      { type: 'separator' },
      tabsSupported && {
        label: 'Show Previous Tab',
        accelerator: 'CmdOrCtrl+Shift+[',
        role: 'selectPreviousTab',
      },
      tabsSupported && {
        label: 'Show Next Tab',
        accelerator: 'CmdOrCtrl+Shift+]',
        role: 'selectNextTab',
      },
    ].filter(Boolean),
  };

  const helpMenu = {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Visit Website',
        click: () => shell.openExternal('https://untitlednote.xyz/'),
      },
    ],
  };

  return Menu.buildFromTemplate(
    [isMac && appMenu, editMenu, viewMenu, windowMenu, helpMenu].filter(Boolean)
  );
};
