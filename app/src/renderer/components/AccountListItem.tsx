import { Account } from 'datatypes';

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
