const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const serve = require("electron-serve");
const fs = require("fs");
const path = require("path");
const Store = require('electron-store')

const appServe = app.isPackaged ? serve({
  directory: path.join(__dirname, "../out")
}) : null;

let win
let store = new Store({ accessPropertiesByDotNotation: false })
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,


      enableRemoteModule: true,



    },
    autoHideMenuBar: true,

  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });

    // win.once('ready-to-show',() => {
    //   if(store.size > 0 && win){
    //     win.webContents.send('store',store.store)
    //   }
    //   win.show()

    // })
  }
}

const getdata = async (e, d) => {
  return store.store
}

app.on("ready", () => {
  console.log(path.join(__dirname, "main.js"))


  ipcMain.handle('store', getdata)
  createWindow();

  for (let i in store.store) {
    if (store.store[i].status === true) {
      shell.openPath(store.store[i].path).catch(err => {
        console.error(err);
      }).then(res => {
        console.log(res)
      })
    }

  }



});


app.setLoginItemSettings({
  openAtLogin: false,
  path: app.getPath('exe')

})



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



// Handle file upload
ipcMain.on('open-file-dialog', (event, data) => {


  dialog.showOpenDialog(win, {
    properties: ['openFile'],
  })
    .then(result => {
      if (!result.canceled) {
        // get the file size
        const stats = fs.statSync(result.filePaths[0]);
        const fileSizeInBytes = stats.size;
        let formattedSize;
        if (fileSizeInBytes < 1024) {
          formattedSize = fileSizeInBytes + " B";
        } else if (fileSizeInBytes < 1024 * 1024) {
          formattedSize = (fileSizeInBytes / 1024).toFixed(2) + " KB";
        } else {
          formattedSize = (fileSizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
        }



        event.sender.send('selected-file', {
          file_name: path.basename(result.filePaths[0]),
          size: formattedSize,
          path: result.filePaths[0]

        });
      }
    })
    .catch(err => {
      console.error(err);
    });
});


ipcMain.on('runfile', (e, d) => {


  if (d.status == false) {
    store.delete(d.file_name)

  }
  else {
    store.set(d.file_name, {
      path: d.path,
      size: d.size,
      status: d.status

    })
  }

  e.sender.send('msg', 'settings saved')


  // const filepath = store.get()
  console.log(store.store)




})


ipcMain.on('open-help-window', (e, d) => {
  const helpWindow = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  })

  helpWindow.loadURL("http://localhost:3000/help");



  helpWindow.webContents.on("did-fail-load", (e, code, desc) => {
    helpWindow.webContents.reloadIgnoringCache();
  });

}
)