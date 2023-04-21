import { Rule } from 'datatypes';

interface RuleListItemProps {
  rule: Rule;
}

export default function RuleListItem({ rule }: RuleListItemProps) {
  return (
    <>
      <div>{rule.name}</div>
      {rule.conditions.mail.map((mailCondition) => (
        <div>{`${mailCondition.type}:${mailCondition.area}:${mailCondition.match}:${mailCondition.query}`}</div>
      ))}
    </>
  );
}
