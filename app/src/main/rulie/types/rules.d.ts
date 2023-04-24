export interface IRuleFilter {
  id: string; // UUID
  field: 'from' | 'to' | 'subject' | 'body';
  match: 'contains' | 'is' | 'startsWith' | 'endsWith';
  query: string;
}

export type ITime = string | number;

export interface IRuleTimeframe {
  id: string; // UUID
  type: 'before' | 'after' | 'between' | 'notBetween';
  time: ITime | [ITime, ITime];
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
