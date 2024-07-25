const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const { Create, read } = require('./crud')
const fs = require('fs');
const { autoUpdater } = require("electron-updater");
const packageJson = require('../package.json');


let appServe;

if (app.isPackaged) {
  (async () => {
    appServe = (await import('electron-serve')).default({
      directory: path.join(__dirname, "../out")
    });
  })();
}


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,

    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../resources/icon.png"),

  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    // win.webContents.openDevTools({
    //   mode: "detach"
    // });
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });


    win.webContents.on('did-finish-load', () => {
      console.log('did-finish-load')

      startallfile()

    })


    win.webContents.on('dom-ready', () => {
      // console.log('dom ready')

    })
  }
}
function checkstartup() {
  const l = app.getLoginItemSettings()
  return l.openAtLogin
}


app.whenReady().then(() => {
  ipcMain.handle('dialog', opendialog)
  ipcMain.handle('getstartup', checkstartup)
  ipcMain.handle('get-version', () => {
    return packageJson.version;
  });
  createWindow()
  autoUpdater.checkForUpdatesAndNotify({
    title: "Update Available",
    body: "A new version of the app is available. Restart you application !",
  });
})





app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function showMessageBox(msg, id) {


  await dialog.showMessageBox({
    type: 'info',
    title: 'Information',
    message: msg,
    detail: id,
    buttons: ['OK']
  }).then(result => {
    console.log('Button clicked:', result.response);
  });
}


async function opendialog() {
  const { canceled, filePaths } = await dialog.showOpenDialog()


  if (filePaths[0]) {
    console.log('File path: ', filePaths[0])
    await Create(filePaths[0]).then(result => {
      showMessageBox(`File uploaded successfully`, result)
      // console.log(result)

    })

  }

  if (!canceled) {
    console.log('cancel')
    return filePaths[0]
  }




}


async function startallfile() {
  const a = await read()
  for (let index = 0; index < a.length; index++) {
    var file = a[index].filepath
    fs.access(file, (err) => {
      if (err) {
        console.error(err)
        showMessageBox(`File not found: ${file}`, err.code)
      } else {
        console.log(`File found: ${file}`)
        shell.openPath(file).then(() => {
          console.log('File opened')
        }).catch(err => {
          console.error(err)
        })

      }
    })


  }

}



function startup(check) {
  console.log(check)
  console.log('startup')
  app.setLoginItemSettings({
    openAtLogin: check,
    path: app.getPath('exe')
  })



}

ipcMain.on('startup', (e, d) => {
  startup(d)

})