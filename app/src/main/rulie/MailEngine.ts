/* eslint-disable no-console, lines-between-class-members, class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
// import { authenticate } from '@google-cloud/local-auth';
// import { safeStorage } from 'electron';
import { google } from 'googleapis';
import ElectronStore from 'electron-store';
import {
  IMail,
  IMailAccount,
  IMailStore,
  MailEngineOptions,
} from './types/mail';

class MailEngine {
  private mailStore: ElectronStore;
  private accounts: IMailAccount[];
  private mails: IMailStore;
  // eslint-disable-next-line no-unused-vars
  private handleNewMail: (account: IMailAccount, mail: IMail) => boolean;
  private options: MailEngineOptions;

  constructor(options?: MailEngineOptions) {
    // Initialize mailStore
    console.log('🌈 MailEngine constructor called');
    this.mailStore = new ElectronStore({
      name: 'mailStore',
      defaults: {
        accounts: [],
        mails: {},
        options: {},
      },
    });
    // Initialize handleNewMail
    this.handleNewMail = (account: IMailAccount, mail: IMail) => {
      console.log(
        `🚧 Warning, handleNewMail on mail.${mail.id} but no callback has been set`
      );
      return false;
    };

    // Initialize accounts
    this.accounts = this.mailStore.get('accounts', []) as IMailAccount[];
    // Initialize mails
    this.mails = this.mailStore.get('mails', {}) as IMailStore;
    // Initialize options
    this.options = options || {};
    // Load gmail credentials from .env
    // TODO: credentials!
  }

  public listAccounts(): IMailAccount[] {
    // List all mail accounts
    return this.accounts;
  }

  public createAccount(account: IMailAccount): Promise<string> {
    // Create a new mail account
    // 1. If the account doesnt have an id, generate one from the email and host
    account.id = account.id || uuidv4();
    return new Promise((resolve, reject) => {
      // 2. Check if the account already exists
      if (this.accounts.find((a) => a.id === account.id)) {
        // 3. If it does, reject the promise
        // TODO: Do something smarter than just rejecting when the account already exists
        reject(Error('Account already exists'));
      } else {
        // 4. If it doesn't, add it
        // TODO: If the account is a gmail account, ask the user to authenticate
        this.accounts.push(account);
        this.mailStore.set('accounts', this.accounts);
        this.mails[account.id] = [];
        this.mailStore.set('mails', this.mails);
        // TODO: This may be a bad pattern. It is easy to forget to call set() after modifying. Consider wrapping with a getter/setter pattern
        // 5. Return with the id of the new account
        resolve(account.id);
      }
    });
  }

  public updateAccount(account: IMailAccount): Promise<boolean> {
    // Update an existing mail account
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
    console.log(`💌 testAccount call in MailEngine on account ${account.id}`);
    // Test a mail account's configuration
    return new Promise((resolve, reject) => {
      reject(Error('Not implemented yet'));
    });
  }
  public deleteAccount(accountId: string): Promise<boolean> {
    // Delete a mail account
    // 1. If the account exists, delete it and resolve the promise
    const index = this.accounts.findIndex((a) => a.id === accountId);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      this.mailStore.set('accounts', this.accounts);
      delete this.mails[accountId];
      this.mailStore.delete(`mails.${accountId}`); // dot notation should work
      return Promise.resolve(true);
    }
    // 2. If the account doesn't exist, reject the promise
    return Promise.reject(Error('Account does not exist'));
  }

  private pruneOldMail(): void {
    // Prune old mail from the mail store to keep the size down
    // TODO: Implement pruning
  }

  private async checkMail(account: IMailAccount): Promise<void> {
    console.log(`💌 checkMail call in MailEngine for ${account.email}`);
    console.log(
      `${account.enabled ? '👍 account is enabled' : '👎 account is disabled'}`
    );

    // Check for mail account for new mail
    // 1. Fetch new mail (if any)
    if (account.enabled) {
      const newMails: IMail[] = [];
      // for gmail accounts
      if (account.type === 'gmail') {
        // TODO : If the token is expired, handle the error and ask the user refresh it
        const auth = google.auth.fromJSON(account.token!);
        const gmail = google.gmail({ version: 'v1', auth });
        const query = 'is:unread';
        const res = await gmail.users.messages.list({
          userId: 'me',
          q: query,
        });

        const { messages } = res.data;

        // for each message check if its in this accounts mail store
        // if not, add it to the newMails array
        const newUnseenMessages = messages?.filter((incomingMail) => {
          return !this.mails[account.id]?.find(
            (storedMail) => storedMail.id === incomingMail.id
          );
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const message of newUnseenMessages!) {
          // TODO: Getting mail might actually take quite a while. Maybe provide UI feedback
          console.log('boink');
          // eslint-disable-next-line no-await-in-loop
          const messageDetails = await gmail.users.messages.get({
            userId: 'me',
            id: message.id ?? '', // should never be undefined so should probably except here if it is
          });
          // TODO: Implement body parsing. Will use snippet for now
          // let body = '';
          // messageDetails.data.payload.parts.forEach((part) => {
          //   if (part.mimeType === 'text/plain') {
          //     body += Buffer.from(part.body.data, 'base64').toString();
          //   }
          // });
          newMails.push({
            id: message.id ?? '', // same as above
            handled: false,
            snippet: messageDetails.data?.snippet,
            date: Date.parse(
              messageDetails.data.payload?.headers?.find(
                (header) => header.name === 'Date'
              )?.value ?? ''
            ),
            from: messageDetails.data.payload?.headers?.find(
              (header) => header.name === 'From'
            )?.value,
            to: messageDetails.data.payload?.headers?.find(
              (header) => header.name === 'To'
            )?.value,
            subject: messageDetails.data.payload?.headers?.find(
              (header) => header.name === 'Subject'
            )?.value,
            body: messageDetails.data?.snippet, // Quick hack to get body as snippet contains most of the body
          });
        }
      }
      // for IMAP accounts
      else if (account.type === 'imap') {
        console.warn('🚧 IMAP accounts not implemented yet');
      }
      // 2. Save it in the mailStore under this accounts id
      this.mails[account.id] = [...this.mails[account.id], ...newMails];
      this.mailStore.set('mails', this.mails);
      // 3. Call the handleNewMail callback on all unhandled mail
      this.mails[account.id].forEach((mail) => {
        if (!mail.handled) {
          console.log(
            `📬 calling handleNewMail callback for '${mail.subject}'`
          );
          if (this.handleNewMail(account, mail)) {
            // 4. If the callback returns true, remove the mail from the store
            mail.snippet = null;
            mail.from = null;
            mail.to = null;
            mail.subject = null;
            mail.body = null;
            mail.handled = true;
          }
        }
      });
      this.mailStore.set('mails', this.mails);
    }

    this.pruneOldMail();
  }

  public async checkAllMail(): Promise<void> {
    console.log('📫 checkAllMail call in MailEngine');
    this.accounts.forEach((account) => {
      this.checkMail(account);
    });
  }

  public onNewMail(
    // eslint-disable-next-line no-unused-vars
    callback: (account: IMailAccount, mail: IMail) => boolean
  ): void {
    // Set the handleNewMail callback
    this.handleNewMail = callback;
  }

  public clearStore(accountId?: string): void {
    console.log(
      `🚧 clearStore not implemented yet! called in MailEngine for ${accountId}`
    );
    // TODO: Implement
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
