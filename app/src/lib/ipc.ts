import { IpcRenderer } from 'electron';

export interface IIpcEvent {
  eventName: string;
  callback: (arg: any) => void;
}

export function createIpcHandler(ipcRenderer: IpcRenderer, event: IIpcEvent) {
  ipcRenderer.on(event.eventName, (_event, arg) => {
    event.callback(arg);
  });
  // fire the event to get the initial state
  ipcRenderer.send(event.eventName);
}
