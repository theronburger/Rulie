/* eslint-disable lines-between-class-members, class-methods-use-this */
import Imap, { ImapMessage } from 'node-imap';
import ElectronStore from 'electron-store';
import { IMail, IMailAccount, MailEngineOptions } from './types/mail';
// import { safeStorage } from 'electron';

// TODO: Is it safe to use indices as keys?
interface mailStoreSchema {
  accounts: IMailAccount[];
  mails: [IMail[]]; // Store the uids of seen mails. Account 0's mails would be mails[0]
  options: MailEngineOptions;
}

class MailEngine {
  private mailStore: ElectronStore;
  private accounts: IMailAccount[];
  private mails: [IMail[]];
  private handleNewMail: (mail: ImapMessage) => boolean;
  private options: MailEngineOptions;

  constructor(options?: MailEngineOptions) {
    // Initialize mailStore
    this.mailStore = new ElectronStore({
      name: 'mailStore',
      defaults: {
        accounts: [],
        mails: [],
        options: {},
      },
    });

    // Initialize accounts
    this.accounts = this.mailStore.get('accounts', []) as IMailAccount[];
    // Initialize mails
    this.mails = this.mailStore.get('mails', []) as [IMail[]];
    // Initialize options
    this.options = options || {};
  }

  public listAccounts(): IMailAccount[] {
    // List all mail accounts
    return this.accounts;
  }

  public createAccount(account: IMailAccount): Promise<string> {
    // Create a new mail account
    // 1. If the account doesnt have an id, generate one from the email and host
    account.id = account.id || `${account.email}@${account.host}`;
    return new Promise((resolve, reject) => {
      // 2. Check if the account already exists
      if (this.accounts.find((a) => a.id === account.id)) {
        // 3. If it does, reject the promise
        // TODO: Do something smarter than just rejecting when the account already exists
        reject(Error('Account already exists'));
      } else {
        // 4. If it doesn't, add it
        this.accounts.push(account);
        this.mailStore.set('accounts', this.accounts);
        this.mails.push([]);
        this.mailStore.set('mails', this.mails);
        // TODO: This may be a bad pattern. It is easy to forget to call set() after modifying. Consider wrapping with a getter/setter pattern
        // 5. Return with the id of the new account
        resolve(account.id);
      }
    });
  }

  public updateAccount(account: IMailAccount): Promise<boolean> {
    // Update an existing mail account
    // 1. If the account doesn't have an id, generate one
    account.id = account.id || `${account.email}@${account.host}`;
    // 2. If the account exists, update it and resolve the promise
    const index = this.accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      this.accounts[index] = account;
      return Promise.resolve(true);
    }
    // 3. If the account doesn't exist, reject the promise
    return Promise.reject(Error('Account does not exist'));
  }

  public testAccount(account: IMailAccount): Promise<boolean> {
    // Test a mail account's configuration
  }

  public deleteAccount(accountId: string): Promise<boolean> {
    // Delete a mail account
    // 1. If the account exists, delete it and resolve the promise
    const index = this.accounts.findIndex((a) => a.id === accountId);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      this.mailStore.set('accounts', this.accounts);
      this.mails.splice(index, 1);
      this.mailStore.set('mails', this.mails);
      return Promise.resolve(true);
    }
    // 2. If the account doesn't exist, reject the promise
    return Promise.reject(Error('Account does not exist'));
  }

  private async checkMail(account: IMailAccount): Promise<void> {
    // Check for mail account for new mail
    // 1. Fetch new mail (if any)
    // 2. Save it in the mailStore under this accounts id
    // 3. Call the handleNewMail callback on all unhandled mail
    // 4. If the callback returns true, remove the mail from the store
  }

  public async checkAllMail(): Promise<void> {
    // Check for new mail in all enabled accounts
  }

  public onNewMail(callback: (mail: IMail) => boolean): void {
    // Set the handleNewMail callback
    this.handleNewMail = callback;
  }

  public clearStore(accountId?: string): void {
    // Clear mail data from the mailStore
    // if accountId is specified, only clear data for that account
    // otherwise, clear all data
  }

  public setOptions(options: MailEngineOptions): void {
    // Set additional options
    this.options = options;
    this.mailStore.set('options', options);
  }

  public getOptions(): MailEngineOptions {
    // Get additional options
    return this.options; // TODO: Is this safe? Can I assume this.options is up to date.
  }
}

export default MailEngine;
