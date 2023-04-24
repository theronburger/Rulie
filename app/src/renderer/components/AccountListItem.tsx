import { Account } from 'main/rulie/types/context';

interface AccountListItemProps {
  account: Account;
}

export default function AccountListItem({ account }: AccountListItemProps) {
  return (
    <>
      <div>{account.email}</div>
      <div>Enabled : {account.enabled}</div>
    </>
  );
}
