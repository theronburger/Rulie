import React, { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import SettingsAccountList from './SettingsAccountList';

import './Settings.css';

interface SettingsProps {
  trigger?: React.ReactNode;
}

function Settings({ trigger }: SettingsProps) {
  const triggerRef = useRef<React.ReactNode>(null);
  const [page, setPage] = useState('settings');

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={triggerRef !== null}>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          {page === 'settings' && <SettingsAccountList setPage={setPage} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Settings;
