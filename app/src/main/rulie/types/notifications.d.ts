// TODO: Move interfaces to src folder
export interface ScheduledNotification {
  id: string; // UUID
  mailId: string; // Mail IMAP UID from server
  ruleId: string;
  accountId: string;
  scheduledTime: number;
  title: string;
  body: string;
}
