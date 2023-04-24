import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IMailAccount } from './rulie/MailEngine';
import { IRule } from './rulie/RuleEngine';
import { ISettings } from './rulie/rulieCore';

export type Channels =
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
    sendMessage(channel: Channels, args?: unknown[]) {
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
    // New methods for the new channels
    getAccounts() {
      console.log('🧑‍🔬 getAccounts call in preload.ts');
      return ipcRenderer.invoke('getAccounts');
    },
    createAccount(account: IMailAccount) {
      console.log('🧑‍🔬 createAccount call in preload.ts');
      return ipcRenderer.invoke('createAccount', account);
    },
    updateAccount(account: IMailAccount) {
      console.log('🧑‍🔬 updateAccount call in preload.ts');
      return ipcRenderer.invoke('updateAccount', account);
    },
    testAccount(account: IMailAccount) {
      console.log('🧑‍🔬 testAccount call in preload.ts');
      return ipcRenderer.invoke('testAccount', account);
    },
    deleteAccount(account: IMailAccount) {
      console.log('🧑‍🔬 deleteAccount call in preload.ts');
      return ipcRenderer.invoke('deleteAccount', account);
    },
    getRules() {
      console.log('🧑‍🔬 getRules call in preload.ts');
      return ipcRenderer.invoke('getRules');
    },
    createRule(rule: IRule) {
      console.log('🧑‍🔬 createRule call in preload.ts');
      return ipcRenderer.invoke('createRule', rule);
    },
    updateRule(rule: IRule) {
      console.log('🧑‍🔬 updateRule call in preload.ts');
      return ipcRenderer.invoke('updateRule', rule);
    },
    deleteRule(rule: IRule) {
      console.log('🧑‍🔬 deleteRule call in preload.ts');
      return ipcRenderer.invoke('deleteRule', rule);
    },
    getSettings() {
      console.log('🧑‍🔬 getSettings call in preload.ts');
      return ipcRenderer.invoke('getSettings');
    },
    updateSettings(settings: ISettings) {
      console.log('🧑‍🔬 updateSettings call in preload.ts');
      return ipcRenderer.invoke('updateSettings', settings);
    },
  },
};

// Expose electronHandler to the window object
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
