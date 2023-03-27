/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld(
  'comunicacion',
  {
    grabarConsulta: (parametros) => ipcRenderer.send('grabar', parametros)
  }
)
contextBridge.exposeInMainWorld(
  'consulta',
  {
    enviar: () => ipcRenderer.send('activar')
    ,
    recibir: (canal, callback) =>ipcRenderer.on('respuesta',callback)
  }
)

