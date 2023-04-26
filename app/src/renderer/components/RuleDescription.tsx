/* eslint-disable react/jsx-props-no-spreading */
import { cn } from 'lib/utils';
import { IRule, IRuleFilter, IRuleTimeframe } from 'main/rulie/types/rules';
import React from 'react';

interface DescriptionProps {
  className?: string;
  rule: IRule;
}

export default function RuleDescription({
  className,
  rule,
  ...props
}: DescriptionProps) {
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
  let scheduleText;

  if (scheduleType === 'immediately') {
    scheduleText = 'send a notification immediately';
  } else if (scheduleType === 'every') {
    scheduleText = `send a notification every ${scheduleTime}`;
  } else if (scheduleType === 'at') {
    scheduleText = `send a notification at ${scheduleTime}`;
  }

  return (
    <div className={cn(className)} {...props}>
      <div>If a mail arrives where :</div>
      <div>{filters}</div> and it&apos;s <span>{timeframes}</span>, <br />
      then <span>{scheduleText}</span>.
    </div>
  );
}
