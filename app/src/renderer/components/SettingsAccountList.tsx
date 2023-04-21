import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Page } from './Settings';

interface SettingsAccountListProps {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function SettingsAccountList({
  setPage,
}: SettingsAccountListProps) {
  return (
    <>
      <Dialog.Title className="DialogTitle">Mail Accounts</Dialog.Title>
      <Dialog.Description className="DialogDescription">
        Which email accounts should Rulie monitor?
      </Dialog.Description>
      <button
        className="Button black"
        type="button"
        onClick={() => setPage('new')}
      >
        Add Account...
      </button>
      <Dialog.Close asChild>
        <button className="IconButton" aria-label="Close" type="button">
          <Cross2Icon />
        </button>
      </Dialog.Close>
    </>
  );
}
