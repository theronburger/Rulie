import { useData } from 'renderer/Context';
import AccountListItem from './AccountListItem';

// interface RuleListProps {
// }

export default function AccountList() {
  const { accounts } = useData();
  return (
    <>
      <div>Account list :</div>
      {accounts.map((account) => (
        <AccountListItem account={account} />
      ))}
    </>
  );
}
