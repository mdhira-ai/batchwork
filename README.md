## Getting Started

Follow these instructions to set up and run the project.

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v14.x or later)
- Yarn (v1.x or later) or npm (v6.x or later)

### Installation

1. **Create a Next.js application:**

   Using Yarn:
   ```bash
   yarn create next-app
   ```

   Using npm:
   ```bash
   npx create-next-app@latest
   ```

2. **Install development dependencies:**

   Using Yarn:
   ```bash
   yarn add --dev electron electron-builder concurrently
   ```

   Using npm:
   ```bash
   npm install electron electron-builder concurrently --save-dev
   ```

3. **Install `electron-serve`:**

   Using Yarn:
   ```bash
   yarn add electron-serve
   ```

   Using npm:
   ```bash
   npm install electron-serve
   ```

### Project Structure

1. **Update `package.json` to include the following:**
   ```json
   {
     "main": "main/main.js",
     "author": "Md Habibor Rahman Hira",
     "description": "Boreal software company",
     "scripts": {
       "dev": "concurrently -n \"NEXT,ELECTRON\" -c \"yellow,blue\" --kill-others \"next dev\" \"electron .\"",
       "build": "next build && electron-builder"
     }
   }
   ```

2. **Create `next.config.js`:**
   ```js
   const nextConfig = {
     output: "export",
     images: {
       unoptimized: true
     }
   };

   module.exports = nextConfig;
   ```

3. **Create `main/main.js`:**
   ```js
   const { app, BrowserWindow } = require("electron");
   const path = require("path");

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
       webPreferences: {
         preload: path.join(__dirname, "preload.js")
       }
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
     }
   };

   app.on("ready", () => {
     createWindow();
   });

   app.on("window-all-closed", () => {
     if (process.platform !== "darwin") {
       app.quit();
     }
   });
   ```

4. **Create `main/preload.js`:**
   ```js
   const { contextBridge, ipcRenderer } = require("electron");

   contextBridge.exposeInMainWorld("electronAPI", {
     on: (channel, callback) => {
       ipcRenderer.on(channel, callback);
     },
     send: (channel, args) => {
       ipcRenderer.send(channel, args);
     }
   });
   ```

5. **Create `electron-builder.yaml`:**
   ```yaml
   appId: "app.Borealsoftwarecompany.com"
   productName: "Boreal software company"
   copyright: "Copyright (c) 2023 Boreal software company"
   win:
     target: ["dir", "portable", "zip"]
     icon: "resources/icon.ico"
   linux:
     target: ["dir", "appimage", "zip"]
     icon: "resources/icon.png"
   mac:
     target: ["dir", "dmg", "zip"]
     icon: "resources/icon.icns"
   ```

### Adding Updates

1. **Install `electron-updater`:**

   Using Yarn:
   ```bash
   yarn add electron-updater
   ```

   Using npm:
   ```bash
   npm install electron-updater
   ```

2. **Update `package.json` to include the following for building and publishing:**
   ```json
   {
     "build": {
       "appId": "com.Borealsoftwarecompany.myappname",
       "files": [
         "!node_modules"
       ],
       "nsis": {
         "oneClick": false,
         "perMachine": true
       },
       "productName": "myappname",
       "win": {
         "icon": "/resources/icon.png",
         "publish": [
           "github"
         ]
       },
       "linux": {
         "icon": "/resources/icon.png",
         "publish": [
           "github"
         ]
       }
     },
     "electronBuilder": {
       "asar": true,
       "compression": "maximum"
     },
     "repository": "https://github.com/mdhira-ai/batchwork",
     "license": "MIT",
     "publish": {
       "provider": "github",
       "releaseType": "release"
     }
   }
   ```

## Running the Application

1. **Development:**
   ```bash
   yarn dev
   ```

   or

   ```bash
   npm run dev
   ```

2. **Build:**
   ```bash
   yarn build
   ```

   or

   ```bash
   npm run build
   ```

## Author

- **Md Habibor Rahman Hira** - *Initial work* - [Habib Software Industry](https://github.com/mdhira-ai)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the Electron and Next.js communities for their invaluable resources and support.