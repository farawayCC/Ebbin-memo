const { app, BrowserWindow, ipcMain, Notification, Tray, Menu } = require('electron');
const path = require('node:path');

let mainWindow;
let tray;
let quitting = false;
const devURL = !app.isPackaged && process.env.ELECTRON_RENDERER_URL;
const assetsDirectory = path.join(__dirname, app.isPackaged ? '../build' : '../public');

function showWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) createWindow();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 620, height: 460, minWidth: 380, minHeight: 380,
    icon: path.join(assetsDirectory, 'icon.png'),
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });
  if (devURL) mainWindow.loadURL(devURL);
  else mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  mainWindow.setMenu(null);
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  mainWindow.on('minimize', (event) => {
    if (tray) { event.preventDefault(); mainWindow.hide(); }
  });
  mainWindow.on('close', (event) => {
    if (!quitting && tray) { event.preventDefault(); mainWindow.hide(); }
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.setAppUserModelId('com.example.EbbinMemo');
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', showWindow);
  app.whenReady().then(() => {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
      { role: 'editMenu' },
    ]));
    createWindow();
    try {
      tray = new Tray(path.join(assetsDirectory, 'images/tray.png'));
      tray.setToolTip('Open Ebbin Memo');
      tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Open Ebbin Memo', click: showWindow },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
      ]));
      tray.on('click', showWindow);
    } catch (error) {
      // Leave normal window closing available on systems without a tray.
      console.error('Tray unavailable:', error.message);
    }
  });
  app.on('activate', showWindow);
  app.on('before-quit', () => { quitting = true; });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}

ipcMain.on('notify', (event, payload) => {
  if (!mainWindow || event.sender !== mainWindow.webContents ||
      event.senderFrame !== mainWindow.webContents.mainFrame ||
      typeof payload?.body !== 'string' || !Notification.isSupported()) return;
  const notification = new Notification({ title: 'Time to repeat', body: payload.body.slice(0, 1000) });
  notification.on('click', showWindow);
  notification.show();
});
