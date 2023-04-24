// TODO: Move interfaces to src folder
export interface ScheduledNotification {
  id: string; // UUID
  mailUid: number; // Mail IMAP UID from server
  ruleId: string;
  accountId: string;
  scheduledTime: string;
}
