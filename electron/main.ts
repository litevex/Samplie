import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import fs from "fs/promises";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Samplie",
    width: 800,
    height: 600,
    backgroundMaterial: "mica",
    vibrancy: "fullscreen-ui",
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
      sandbox: false,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: "#00000000",
      height: 35,
      symbolColor: "#e5e5e5",
    },
  });
  
  nativeTheme.themeSource = "dark";

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  } else {
    mainWindow.loadFile(
      path.join(
        import.meta.dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      ),
    );
  }

  ipcMain.on('ondragstart', (event, filePath) => {
    console.log("documents:", app.getPath('documents'));
    const sampleFolder = path.join(app.getPath('documents'), "OpenSplice", "Samples");
    console.log('Drag started for file:', sampleFolder, filePath);
    console.log(event.sender);
    event.sender.startDrag({
      file: path.join(sampleFolder, filePath),
      icon: path.join(app.getPath('documents'), "OpenSplice", "file.png")
    })
  })

  ipcMain.handle('download-sample', async (event, sampleId: string, sampleName: string) => {
    console.log(`Downloading sample ${sampleId} with name ${sampleName}`);
    const sampleFolder = path.join(app.getPath('documents'), "OpenSplice", "Samples");
    const samplePath = path.join(sampleFolder, sampleName);

    // check if file already exists
    try {
      await fs.access(samplePath);
      console.log(`Sample ${sampleName} already exists, skipping download`);
      return;
    } catch (err) {}

    const sampleURL = `http://localhost:3000/audio/${sampleId}`;

    const fetchResp = await fetch(sampleURL);
    if (!fetchResp.ok) {
      console.error(`Failed to download sample ${sampleId}: ${fetchResp.statusText}`);
      return;
    }
    const arrayBuffer = await fetchResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.mkdir(sampleFolder, { recursive: true });
    await fs.writeFile(samplePath, buffer);
  });

  ipcMain.handle('set-always-on-top', (event, isAlwaysOnTop: boolean) => {
    mainWindow.setVisibleOnAllWorkspaces(isAlwaysOnTop, { visibleOnFullScreen: true });
    mainWindow.setAlwaysOnTop(isAlwaysOnTop, "screen-saver", 1);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
