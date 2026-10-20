const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ebbinMemo', {
  notify: (body) => {
    if (typeof body === 'string') ipcRenderer.send('notify', { body });
  },
});
