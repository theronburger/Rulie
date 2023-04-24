/* eslint-disable no-console, lines-between-class-members, class-methods-use-this  */
import { v4 as uuidv4 } from 'uuid';
import ElectronStore from 'electron-store';
import { Notification } from 'electron';
import { ScheduledNotification } from './types/notifications';
import { IRule, IRuleNotificationSchedule } from './types/rules';
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

  private calculateScheduledTime(
    notificationSchedule: IRuleNotificationSchedule
  ): number {
    const { type, time } = notificationSchedule;

    // Get the current date
    const now = new Date();

    // If the type is 'immediately', schedule it for now
    if (type === 'immediately') {
      return now.getTime();
    }

    // If the type is 'at', calculate the time for the next occurrence of the specified time
    if (type === 'at') {
      // Parse the hours and minutes from the provided time
      const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));

      // Set the scheduled date to the specified time today
      const scheduledDate = new Date(now);
      scheduledDate.setHours(hours);
      scheduledDate.setMinutes(minutes);
      scheduledDate.setSeconds(0);
      scheduledDate.setMilliseconds(0);

      // If the scheduled date is in the past, add one day to get the next occurrence
      if (scheduledDate < now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      return scheduledDate.getTime();
    }

    // If the type is 'every', calculate the time for the next slot
    if (type === 'every') {
      // Define a constant for 15 minutes in milliseconds
      const FIFTEEN_MINUTES = 15 * 60 * 1000;

      // Calculate the duration in milliseconds based on the provided time
      const duration =
        parseInt(time.slice(0, -1), 10) *
        (time.endsWith('h') ? 60 * 60 * 1000 : FIFTEEN_MINUTES);

      // Calculate the next slot
      const nextSlot = new Date(Math.ceil(now.getTime() / duration) * duration);

      return nextSlot.getTime();
    }

    throw new Error(`Invalid notificationSchedule type: ${type}`);
  }

  public scheduleNotification(
    mail: IMail,
    rule: IRule,
    accountId: string
  ): string {
    // Schedule a notification and return its ID
    // 1. Calculate the time to scheduled the notification

    // 2. Create a ScheduledNotification object with the necessary data
    const notification: ScheduledNotification = {
      id: uuidv4(),
      mailId: mail.id,
      ruleId: rule.id,
      accountId,
      scheduledTime: this.calculateScheduledTime(rule.notificationSchedule),
      title: mail.subject ?? 'No subject',
      body: `From: ${mail.from ?? 'Unknown'}`,
    };
    // 3. Save the ScheduledNotification object in the notificationStore
    this.notifications.push(notification);
    this.notificationStore.set('notifications', this.notifications);
    // 4. Return the ID of the newly created ScheduledNotification
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
    console.warn('🚧 Getting scheduled notifications not yet implemented');
  }

  public clearScheduledNotifications(filters?: {
    ruleId?: string;
    accountId?: string;
  }): void {
    console.warn('🚧 Clearing scheduled notifications not yet implemented');
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
