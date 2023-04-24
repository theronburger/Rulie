export interface IRuleFilter {
  id: string; // UUID
  type: 'include' | 'exclude';
  field: 'from' | 'to' | 'cc' | 'bcc' | 'subject' | 'body' | 'all';
  match: 'contains' | 'is' | 'startsWith' | 'endsWith';
  query: string;
}

export interface IRuleTimeframe {
  id: string; // UUID
  type: 'before' | 'after' | 'between' | 'notBetween';
  time: string | [string, string];
}

export interface RuleNotificationSchedule {
  type: 'immediately' | 'every' | 'at';
  time: string;
}

export interface IRule {
  id: string; // UUID
  name: string;
  filters: IRuleFilter[];
  timeframes: IRuleTimeframe[];
  notificationSchedule: RuleNotificationSchedule;
}
