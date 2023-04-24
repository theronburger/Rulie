/* eslint-disable class-methods-use-this, lines-between-class-members, no-console */
import { ipcMain } from 'electron';
import ElectronStore from 'electron-store';
import MailEngine from './MailEngine';
import NotificationEngine from './NotificationEngine';
import RuleEngine from './RuleEngine';
import { IMail, IMailAccount } from './types/mail';
import { IRule } from './types/rules';

// TODO: Move interfaces to src folder
export interface ISettings {
  mailInterval: number;
  notificationInterval: number;
  theme: string;
}

class RulieCore {
  private mailEngine: MailEngine;
  private notificationEngine: NotificationEngine;
  private ruleEngine: RuleEngine;
  private settingsStore: ElectronStore;
  private settings: ISettings;

  constructor() {
    this.mailEngine = new MailEngine();
    this.notificationEngine = new NotificationEngine();
    this.ruleEngine = new RuleEngine();
    this.settingsStore = new ElectronStore({
      name: 'settings',
      defaults: {
        settings: {
          // having a settings object inside settings is a bit redundant,
          // but it makes dealing with ElectronStore easier
          mailInterval: 15 * 60 * 1000, // 15 minutes
          notificationInterval: 60 * 1000,
        },
      },
    });
    this.settings = this.settingsStore.get('settings') as ISettings;

    // Initialize IPC listeners
    this.initIPC();
  }

  /**
   * Initialize Inter Process Communication listeners for the coreController.
   * This method sets up IPC channels for communication with the renderer process.
   */
  private initIPC(): void {
    // Set up IPC listeners for mailEngine
    ipcMain.on('getAccounts', (event) => {
      console.log('👑 getAccounts call in rulieCore.ts');
      event.reply('getAccounts', this.mailEngine.listAccounts());
    });

    ipcMain.on('createAccount', (event, account: IMailAccount) => {
      console.log('👑 createAccount call in rulieCore.ts');
      event.reply('createAccount', this.mailEngine.createAccount(account));
    });

    ipcMain.on('updateAccount', (event, account: IMailAccount) => {
      console.log('👑 updateAccount call in rulieCore.ts');
      event.reply('updateAccount', this.mailEngine.updateAccount(account));
    });

    ipcMain.on('testAccount', (event, account: IMailAccount) => {
      console.log('👑 testAccount call in rulieCore.ts');
      event.reply('testAccount', this.mailEngine.testAccount(account));
    });

    ipcMain.on('deleteAccount', (event, accountId: string) => {
      console.log('👑 deleteAccount call in rulieCore.ts');
      event.reply('deleteAccount', this.mailEngine.deleteAccount(accountId));
    });

    // Set up IPC listeners for ruleEngine
    ipcMain.on('getRules', (event) => {
      console.log('👑 getRules call in rulieCore.ts');
      event.reply('getRules', this.ruleEngine.listRules());
    });

    ipcMain.on('createRule', (event, rule: IRule) => {
      console.log('👑 createRule call in rulieCore.ts');
      event.reply('createRule', this.ruleEngine.createRule(rule));
    });

    ipcMain.on('updateRule', (event, rule: IRule) => {
      console.log('👑 updateRule call in rulieCore.ts');
      event.reply('updateRule', this.ruleEngine.updateRule(rule));
    });

    ipcMain.on('deleteRule', (event, ruleId: string) => {
      console.log('👑 deleteRule call in rulieCore.ts');
      event.reply('deleteRule', this.ruleEngine.deleteRule(ruleId));
    });

    // Set up IPC listeners for ruleEngine
    // ...

    // Set up IPC listeners for settings
    ipcMain.on('getSettings', (event) => {
      console.log('👑 getSettings call in rulieCore.ts');
      event.reply('getSettings', this.settings);
    });

    ipcMain.on('updateSettings', (event, settings: ISettings) => {
      console.log('👑 updateSettings call in rulieCore.ts');
      this.settings = settings;
      this.settingsStore.set('settings', settings);
      event.reply('updateSettings', true);
    });
  }

  /**
   * Initialize the mail checking route.
   * This function sets up a timeout (recursively called every settings.mailInterval)
   * for calling mailEngine's checkMail method, and passes a function to handle
   * new mails to mailEngine's onNewMail method.
   */
  private initMailChecking(): void {
    // Set up a timeout to call mailEngine's checkMail method
    // 1. Set up the onNewMail handler
    this.mailEngine.onNewMail((mail: IMail) => {
      console.log('👑 onNewMail handler in rulieCore.ts got new mail');
      // Check which rules (if any) the mail matches
      // ...
      // Schedule any notifications using notificationEngine's scheduleNotification method
      // ...
      // return result of notificationEngine's scheduleNotification method
      // TODO: Hardcoded return of onNewMail handler, replace with actual return
      return true;
    });
    // 2. Create a tick function to be called by the timeout;
    const tick = () => {
      // 3. Call mailEngine's checkAllMail method
      this.mailEngine.checkAllMail();
      // 4. Call the anonymous timeout again after settings.mailInterval
      setTimeout(tick, this.settings.mailInterval);
    };
    // 5. Call tick to start the chain
    tick();
  }

  /**
   * Initiate the update of the notification engine.
   * This function sets up a timeout (recursively called every settings.notificationInterval)
   * for calling notificationEngine's update method.
   */
  private initNotificationUpdating(): void {
    // Set up timeout to call notificationEngine's update method
    // ...
  }
}

// Export an instance of RulieCore, so it can be used in Electron's main.ts
export default RulieCore;
