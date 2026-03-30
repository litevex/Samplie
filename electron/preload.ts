import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  startDrag: (fileName: string) => ipcRenderer.send('ondragstart', fileName),
  downloadSample: (sampleId: string, sampleName: string) => ipcRenderer.invoke('download-sample', sampleId, sampleName),
  setAlwaysOnTop: (isAlwaysOnTop: boolean) => ipcRenderer.invoke('set-always-on-top', isAlwaysOnTop),
})