const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));

    },
    send: (channel, args) => {
        ipcRenderer.send(channel, args);
    },

    opendialog: () => ipcRenderer.invoke('dialog'),
    getstartup: () => ipcRenderer.invoke('getstartup'),
    getVersion: () => ipcRenderer.invoke('get-version')

});

