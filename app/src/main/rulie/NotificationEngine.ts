/* eslint-disable lines-between-class-members, class-methods-use-this  */
import ElectronStore from 'electron-store';
import { Notification } from 'electron';
import { ImapMessage } from 'node-imap';
import { ScheduledNotification } from './types/notifications';

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
    mail: ImapMessage,
    ruleId: string,
    accountId: string
  ): string {
    // Schedule a notification and return its ID
    // 1. Create a ScheduledNotification object with the necessary data
    // 2. Save the ScheduledNotification object in the notificationStore
    // 3. Return the ID of the newly created ScheduledNotification
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
    // 1. Check for any ScheduledNotification objects with scheduledTime in the past
    // 2. For each of those ScheduledNotification objects, fire the notification using Electron's Notification API
    // 3. Remove the fired ScheduledNotification objects from the notificationStore
  }

  // TODO: The createNotification method should may be redundant
  private createNotification(mail: ImapMessage, ruleId: string): Notification {
    // Create an Electron Notification instance
    // 1. Set the necessary notification properties based on the ImapMessage and ruleId
    // 2. Return the newly created Notification instance
  }
}

export default NotificationEngine;
