import { IRule } from 'main/rulie/types/rules';

interface RuleListItemProps {
  rule: IRule;
}

export default function RuleListItem({ rule }: RuleListItemProps) {
  return (
    <>
      <div>{rule.name}</div>
      <div>Filters</div>
      {rule.filters.map((filter, i) => (
        <div key={`ruleFilter:${i}`}>{JSON.stringify(filter)}</div>
      ))}
      <div>Time Frames</div>
      {rule.timeframes.map((timeframe) => (
        <div>{JSON.stringify(timeframe)}</div>
      ))}
      <div>Notification Schedule</div>
      <div>{JSON.stringify(rule.notificationSchedule)}</div>
    </>
  );
}
