// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const mysql = require('mysql2')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

let listado
function createWindowtwo () {
  // Create the browser window.
  listado = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  // and load the index.html of the app.
  listado.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Conexión a mysql2
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'api_dba'
})

ipcMain.on('grabar', (event, args) => {
  console.log(args)
  connection.promise().query('insert into registros_busqueda(parametro_busqueda, resultado_busqueda) values (?,?)',
    args)
    .then(
      ([result, fields]) => {
        console.log('registro agreado')
      }
    )
    .catch((err) => {
      console.log(err)
    }
  )
})

ipcMain.on('activar', (event) => {
  const win = BrowserWindow.getFocusedWindow()
  connection.promise().query('select * from registros_busqueda')
    .then(
      ([result, fields]) => {
        win.webContents.send('respuesta', result)
      }
    )
    .catch((err) => {
      console.log(err)
    }
  )
})



