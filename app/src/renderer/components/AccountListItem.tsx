import { IMailAccount } from 'main/rulie/types/mail';

interface AccountListItemProps {
  account: IMailAccount;
}

export default function AccountListItem({ account }: AccountListItemProps) {
  return (
    <div className="py-5">
      <div>{account.email}</div>
      <div>Enabled : {account.enabled ? '✅' : '❌'}</div>
    </div>
  );
}
