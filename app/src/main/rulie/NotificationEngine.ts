/* eslint-disable lines-between-class-members, class-methods-use-this  */
import { v4 as uuidv4 } from 'uuid';
import ElectronStore from 'electron-store';
import { Notification } from 'electron';
import { ImapMessage } from 'node-imap';
import { ScheduledNotification } from './types/notifications';
import { IRule } from './types/rules';
import { IMail } from './types/mail';

class NotificationEngine {
  private notificationStore: ElectronStore;
  private notifications: ScheduledNotification[] = [];

  constructor() {
    // Initialize notificationStore
    this.notificationStore = new ElectronStore({
      name: 'notificationStore',
      defaults: {
        notifications: [],
      },
    });
    // Initialize notifications
    this.notifications = this.notificationStore.get(
      'notifications',
      []
    ) as ScheduledNotification[];
  }

  public scheduleNotification(
    mail: IMail,
    rule: IRule,
    accountId: string
  ): string {
    // Schedule a notification and return its ID
    // 1. Create a ScheduledNotification object with the necessary data
    const notification: ScheduledNotification = {
      id: uuidv4(),
      mailId: mail.id,
      ruleId: rule.id,
      accountId,
      scheduledTime: Date.now(),
    };
    // 2. Save the ScheduledNotification object in the notificationStore
    this.notifications.push(notification);
    this.notificationStore.set('notifications', this.notifications);
    // 3. Return the ID of the newly created ScheduledNotification
    return notification.id;
  }

  public getScheduledNotifications(filters?: {
    ruleId?: string;
    accountId?: string;
  }): ScheduledNotification[] {
    // Get scheduled notifications with optional filters
    // 1. Retrieve all ScheduledNotification objects from the notificationStore
    // 2. Apply filters if provided
    // 3. Return the filtered list of ScheduledNotification objects
  }

  public clearScheduledNotifications(filters?: {
    ruleId?: string;
    accountId?: string;
  }): void {
    // Clear scheduled notifications with optional filters
    // 1. Retrieve all ScheduledNotification objects from the notificationStore
    // 2. Apply filters if provided
    // 3. Remove the filtered ScheduledNotification objects from the notificationStore
  }

  public update(): void {
    // Update the NotificationEngine
    // 1. For each of those ScheduledNotification objects, fire the notification using Electron's Notification API
    let firedNotifications = 0;
    this.notifications.forEach((notification, index) => {
      if (notification.scheduledTime <= Date.now()) {
        this.fireNotification(notification);
        // 2. Remove the fired ScheduledNotification objects from the notificationStore
        this.notifications.splice(index, 1);
        firedNotifications += 1;
      }
    });
    if (firedNotifications > 0) {
      this.notificationStore.set('notifications', this.notifications);
    }
  }

  private fireNotification(notification: ScheduledNotification): void {
    // Create an Electron Notification instance
    console.log(`Firing notification '${notification.title}'`);
    // 1. Set the necessary notification properties
    const newNotification = new Notification({
      title: notification.title,
      body: notification.body,
    });
    newNotification.on('click', () => {
      console.log('Notification clicked');
    });
    // 2. Fire it!
    newNotification.show();
  }
}

export default NotificationEngine;
