<img src="../identity/Logo.png" width="50%" />

# Getting Started

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

# Rulie Architecture Planning
The app, Rulie gives users granular control over mail notifications by allowing them to define rules about which mails should notify them, and when those notifications should happen.

## Rules 
Rules have three parts 
+ The filter (filtering which mail it applies to)
+ The timeframe (when during the day should this rule be applied)
+ The notification schedule (when the notification should be fired)

For displaying the rules, they have an aditional property `name`

```typescript
export interface IRuleFilter {
  id: string; // UUID
  type: 'include' | 'exclude'; // Whether the filter adds to or removes from the selection
  field: 'from' | 'to' | 'cc' | 'bcc' | 'subject' | 'body' | 'all'; // Mail property to query
  match: 'contains' | 'is' | 'startsWith' | 'endsWith';  // Query type 
  query: string;
}

export interface IRuleTimeframe {
  id: string; // UUID
  type: 'before' | 'after' | 'between' | 'notBetween';  
  time: number | [number, number];  // JS Date, milliseconds that has elapsed since the epoch
}

export interface RuleNotificationSchedule {
  type: 'immediately' | 'every' | 'at';
  time: number; // time in milliseconds. 17:00 would be 17 * 60 * 60 * 1000
}

export interface IRule {
  id: string; // UUID
  name: string; // A user settable display name for the rule
  filters: IRuleFilter[]; 
  timeframes: IRuleTimeframe[];
  notificationSchedule: RuleNotificationSchedule;
}

```



## App Structure 
Rulie is an Electron App.
Electron apps have a renderer (Renderer / UI) and a main process (Like a backend)
The main process is located at src/main.
It launches via main.ts
main.ts creates a mainWindow and renders the “frontend” via index.html (transpiled from index.tsx)
The **renderer** is located at src/renderer and is built in React

In the UI users can can :
+ Manage (CRUD) rules
  + Stretch goal feature : While editing a rule, the UI should show matches to help writing the rule

+ Manage (CRUD) email accounts
  + Stretch goal feature : The app should provide a test button to check the account settings.
  + Stretch goal feature : Provide other auth methods.

+ Manage the app settings
  + Stretch goal feature : Add themes & dark mode


Rulie's **backend** logic is located at `src/main/rulie`. `rulieCote.ts` exports a class which is initialized from `main.ts`

There are four main components that extend the Electron **main process.**
+ coreController (rulieCore.ts)
+ mailEngine (an instance of the MailEngine class, imported into coreController from MailEngine.ts )
+ notificationEngine (an instance of the NotificationEngine class, imported int coreController from NotificationEngine)
+ ruleEngine (an instance of the RuleEngine class, imported int coreController from RuleEngine.ts)

## coreController (main process)
 The main entry point created in rulieCore.ts

coreController is exported from rulieCore.ts and called from Electron’s src/main/main.ts
The general pattern is each engine is initialized from within the coreController. 
Each engine maintains its own json data store using the electron-store package [📝 docs]( https://www.npmjs.com/package/electron-store)
All communication with the renderer happens at the coreController level via Inter Process Communication [📝 docs](https://www.electronjs.org/docs/latest/tutorial/ipc)

### Spec 
+ Is a typescript class
+ Initialises an instance of mailEngine
+ Initialises an instance of notificationEngine
+ Initialises an instance of ruleEngine
+ Manages settings using an ElectronStore named `settings`
+ Provides an IPC API for mailEngine, notificationEngine, ruleEngine & settings
+ Interface between the three engines 

#### Engine Interfacing 
+ controls a recusrive timeout calling mailEngine’s `checkMail` method.
+ controls a recusrive timeout calling notificationEngine `update` method.
+ passes a `handleMail` method to mailEngine’s `onNewMail` method.
  + `handleMail` should use ruleEngine’s `check` method to check which rules (if any) the mail matches
  + For each match, `handleMail` shold and use notificationEngine’s `scheduleNotification` to schedule any notifications. 


#### Settings
+ Mail checking interval
+ Scheduler interval
+ App theme

## MailEngine (class, main process)

The mailEngine provides methods to monitor multiple mail accounts for new mails and keep track of which mails have been processed. 

### Spec 

+ Is a typescript class
+ Should be as event driven as possible.
+ Uses node-imap [📝 docs](https://www.npmjs.com/package/node-imap)
+ Manages multiple mail account
+ Use an electron-store instance, named mailStore.
+ Manages its internal data using mailStore, so that if the app is closed unexpectedly nothing is lost. 
+ Account passwords are encrypted using safeStorage.encryptString(plainText)  & safeStorage.decryptString(encrypted)
+ Accounts have an enabled flag, and are only be checked if they are enabled.
+ Provides public methods to list, create, update, test and delete accounts.
+ Provide a public method `onNewMail` that accepts a callback `handleNewMail` which is passed the new mail. 
  + The callback should accept an argument of ImapMessage.
  + The callback returns true on successfully handling the mail or false on failure.

+ Provides a public method `checkAllMail` called externally to trigger mail checking. 
+ Has a private method `checkMail(account)` that :
  + checks an account for new mail, saving it in the mailStore untill handled.
  + Queries the server for recent mails. (one week or newer) 
  + Calls the `handleNewMail` callback set by onNewMail on all unhandled mail in the mailStore. Note that if mail was not handled last call, it should be handled as well. 
  + If the `handleNewMail` returns true, `checkMail` flags the mail as handled in the mailStore and cleans up the ImapMessage stored in the mail's data property as it is no longer needed.
+ Provides a public method `clearStore(account)`. `account` is optional, if not set it clears all mail in the mailStore.
+ Provides `setOptions` and `getOptions` methods, for any additional options.

### MailEngine Notes

ImapMessage has a property uid (A 32-bit ID that uniquely identifies this message within its mailbox)

MailEngine uses this to corolate between the server and its internal database, alowing it to keep track of which mails have been downloaded and processed. 

## NotificationEngine (class, main process)



### Spec

+ A typescript class to schedule and manage scheduled notifications.
+ Be as event driven as possible.
+ use Electrons Notification API.
+ Use an electron-store instance, named notificationStore.
+ Manage it’s internal data using notificationStore, so that if the app is closed unexpectedly nothing is lost. 
+ Provide a public method `scheduleNotification`. Calling it should return the scheduled notification’s ID.
+ Manage a database of notifications (using electron-store) so that scheduled notifications persist if the app is restarted.
+ Keep track of which mail account each notification belongs to.
+ Remove notifications from the database when they are fired, making sure to update notificationStore.
+ Instead of having an internal timer, it should provide a method `update` that is called externally (from coreController) and fires any notifications whose scheduled time is in the past. 
+ Provide a method to get scheduled notifications, taking optional filters like rule or mail account.
+ Provide a method to clear scheduled notifications, taking optional filters like rule or mail account.



## RuleEngine (class, main process)



### Spec 

+ A typescript class to apply rules to mails to schedule notifications.
+ Be as event driven as possible.
+ Use an electron-store instance, named ruleStore.
+ Manage it’s internal data using ruleStore, so that if the app is closed unexpectedly nothing is lost. 
+ Provide a method `check` that accepts mail data via a ImapMessage argument and returns any matched rules.



## UI ( react, renderer)



## Stretch goals
+ The app should be able to be minimized to the menu bar
+ Clicking the notifications should open your mail client of choice, ideally taking you to the mail directly. Maybe using URI magic


## Notes 

+ enableRemoteModule look interesting
+ IPC guide https://www.electronjs.org/docs/latest/tutorial/ipc