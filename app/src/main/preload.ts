/* eslint-disable no-console */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'bang'
  | 'getAccounts'
  | 'createAccount'
  | 'updateAccount'
  | 'testAccount'
  | 'deleteAccount'
  | 'getRules'
  | 'createRule'
  | 'updateRule'
  | 'deleteRule'
  | 'getSettings'
  | 'updateSettings';

const electronHandler = {
  ipcRenderer: {
    send(channel: Channels, args?: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      console.log('🧑‍🔬 on call in preload.ts');
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      console.log('🧑‍🔬 once call in preload.ts');
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

// Expose electronHandler to the window object
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
