import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import SettingsAccountList from './SettingsAccounts';
import SettingsAccount from './SettingsAccount';

interface SettingsProps {
  trigger?: React.ReactNode;
}

export type Page = 'list' | 'new';

function Settings({ trigger }: SettingsProps) {
  const triggerRef = useRef<React.ReactNode>(null);
  const [page, setPage] = useState<Page>('list');

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={triggerRef !== null}>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          {page === 'list' && <SettingsAccountList setPage={setPage} />}
          {page === 'new' && <SettingsAccount setPage={setPage} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Settings;
