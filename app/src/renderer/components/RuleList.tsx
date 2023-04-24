import { useData } from 'renderer/Context';
import RuleListItem from './RuleListItem';

// interface RuleListProps {
// }

export default function RuleList() {
  const { rules } = useData();

  return (
    <>
      <div>Rule list :</div>
      {rules.map((rule) => (
        <RuleListItem rule={rule} />
      ))}
    </>
  );
}
