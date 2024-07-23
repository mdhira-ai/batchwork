const { app, BrowserWindow, ipcMain, dialog, shell, webContents } = require("electron");
const serve = require("electron-serve");
const fs = require("fs");
const path = require("path");
const Store = require("electron-store");
const { autoUpdater } = require("electron-updater");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

let win;
let helpWindow;
let abooutWindow;
let store = new Store({ accessPropertiesByDotNotation: false });
const startupstore = new Store({ accessPropertiesByDotNotation: false });
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../resources/icon.png"),
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
    // win.webContents.openDevTools();
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

  win.on("closed", () => {
    win = null;
  });
};

const getdata = async (e, d) => {
  return store.store;
};

const isstartup = async (e, d) => {
  return startupstore.get("startup");
};

app.on("ready", () => {
  // console.log(path.join(__dirname, "main.js"))

  ipcMain.handle("store", getdata);
  ipcMain.handle("isstartup", isstartup);

  createWindow();

  autoUpdater.checkForUpdatesAndNotify({
    title: "Update Available",
    body: "A new version of the app is available. Restart you application !",
  });

  try {
    for (let i in store.store) {
      if (store.store[i].status === true) {
        if(fs.existsSync(store.store[i].path)){
          console.log('file exist')
          shell
            .openPath(store.store[i].path)
            .catch((err) => {
              console.error(err);
            })
            .then((res) => {
              console.log(res);
            });
        }
        else{
          dialog.showMessageBox(
            {
              type: "error",
              buttons: ["Ok"],
              title: "File Not Found check the file path",
              message: "File Not Found check the file path",
            },
            (response) => {
              console.log(response);
            }
          )
        }

      }
    }
  } catch (err) {
    console.log(err);
  }
});

// app.setLoginItemSettings({
//   openAtLogin: startupstore.get("startup"),
//   path: app.getPath("exe"),
// });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle file upload
ipcMain.on("open-file-dialog", (event, data) => {
  dialog
    .showOpenDialog(win, {
      properties: ["openFile"],
    })
    .then((result) => {
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

        event.sender.send("selected-file", {
          file_name: path.basename(result.filePaths[0]),
          size: formattedSize,
          path: result.filePaths[0],
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

ipcMain.on("runfile", (e, d) => {
  if (d.status == false) {
    store.delete(d.file_name);
  } else {
    store.set(d.file_name, {
      path: d.path,
      size: d.size,
      status: d.status,
    });
  }

  e.sender.send("msg", "settings saved");

  // const filepath = store.get()
  console.log(store.store);
});

ipcMain.on("open-help-window", (e, d) => {
  helpWindow = new BrowserWindow({
    width: 400,
    height: 400,
    icon: path.join(__dirname, "../resources/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
    parent: win,
    modal: true,
    resizable: false,
    movable: false,
  });

  // helpWindow.webContents.openDevTools()

  if (app.isPackaged) {
    helpWindow.loadURL(`app://./help.html`);
  } else {
    helpWindow.loadURL(`http://localhost:3000/help`);
  }
});

ipcMain.on("startup", (e, d) => {
  console.log(d);
  startupstore.set("startup", d);
  console.log(startupstore.store);

  app.setLoginItemSettings({
    openAtLogin: d,
    path: app.getPath("exe"),
  });
});

ipcMain.on("removefile", (e, d) => {
  store.delete(d.file_name);
  console.log(store.store);
});

ipcMain.on("open-about-window", (e, d) => {
  abooutWindow = new BrowserWindow({
    width: 400,
    height: 400,
    icon: path.join(__dirname, "../resources/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
    parent: win,
    modal: true,
    resizable: false,
  });

  if (app.isPackaged) {
    abooutWindow.loadURL(`app://./about.html`);
  } else {
    abooutWindow.loadURL(`http://localhost:3000/about`);
  }
});
