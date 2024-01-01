const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel, args) => {
        ipcRenderer.send(channel, args);
    },
    invoke: (channel, args) => {
        return ipcRenderer.invoke(channel, args);
    },


});


// document.addEventListener('DOMContentLoaded', () => {
//     ipcRenderer.on('store', (e, d) => {
//         // Pass the 'd' data to the frontend
//         console.log(d)
//         document.dispatchEvent(new CustomEvent('dataReceived', { detail: d }));
//     });
// })

