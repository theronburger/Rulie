import React from 'react';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import { Page } from './Settings';
import SelectMenu from './SelectMenu';

import './SettingsAccount.css';

interface AccountProps {
  //   onCancel: () => void;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
}

function SettingsAccount({ setPage }: AccountProps) {
  const protocol = ['IMAP', 'POP'];
  const onCancel = () => {
    setPage('list');
  };
  return (
    <div>
      <Dialog.Title className="DialogTitle">New Account</Dialog.Title>
      <Dialog.Description className="DialogDescription">
        Set up a new mail account.
      </Dialog.Description>
      <Form.Root className="FormRoot">
        <Form.Field className="FormField" name="email">
          <Form.Label className="FormLabel">Email address</Form.Label>
          <Form.Control asChild>
            <input className="Input AccountInput" type="email" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="username">
          <Form.Label className="FormLabel">Username</Form.Label>
          <Form.Control asChild>
            <input className="Input AccountInput" type="text" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="password">
          <Form.Label className="FormLabel">Password</Form.Label>
          <Form.Control asChild>
            <input className="Input AccountInput" type="password" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="account-type">
          <Form.Label className="FormLabel">Account type</Form.Label>
          <SelectMenu
            options={protocol}
            areaLabel="Account type"
            placeholder="select"
            className="AccountInput"
          />
        </Form.Field>
        <Form.Field className="FormField" name="incoming-mail-server">
          <Form.Label className="FormLabel">Incoming Mail Server</Form.Label>
          <Form.Control asChild>
            <input className="Input AccountInput" type="text" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="outgoing-mail-server">
          <Form.Label className="FormLabel">Outgoing Mail Server</Form.Label>
          <Form.Control asChild>
            <input className="Input AccountInput" type="text" required />
          </Form.Control>
        </Form.Field>
        <div className="AccountButtonRow">
          <button onClick={onCancel} className="Button black" type="button">
            Cancel
          </button>
          <Form.Submit asChild>
            <button className="Button black" type="submit">
              Test
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
}

export default SettingsAccount;
