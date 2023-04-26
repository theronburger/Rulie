import { IRule, IRuleFilter, IRuleTimeframe } from 'main/rulie/types/rules';

export default function generateDescription(rule: IRule) {
  const filters = rule.filters
    .map((filter: IRuleFilter) => {
      const { field } = filter;
      const { match } = filter;
      const { query } = filter;

      if (match === 'is') {
        return `${field} is ${query}`;
      }
      if (match === 'contains') {
        return `${field} contains ${query}`;
      }
      if (match === 'startsWith') {
        return `${field} starts with ${query}`;
      }
      if (match === 'endsWith') {
        return `${field} ends with ${query}`;
      }
      return '';
    })
    .join(' or ');

  const timeframes = rule.timeframes
    .map((timeframe: IRuleTimeframe) => {
      const { type } = timeframe;
      const { time } = timeframe;

      if (type === 'after') {
        return `after ${time}`;
      }
      if (type === 'before') {
        return `before ${time}`;
      }
      if (type === 'between') {
        return `between ${time}`;
      }
      return '';
    })
    .join(' and ');

  const { notificationSchedule } = rule;
  const scheduleType = notificationSchedule.type;
  const scheduleTime = notificationSchedule.time;
  let scheduleText = '';

  if (scheduleType === 'immediately') {
    scheduleText = 'send a notification immediately';
  } else if (scheduleType === 'every') {
    scheduleText = `send a notification every ${scheduleTime}`;
  } else if (scheduleType === 'at') {
    scheduleText = `send a notification at ${scheduleTime}`;
  }

  return `If a mail arrives where ${filters} and it's ${timeframes}, then ${scheduleText}.`;
}
