import React from 'react';

export type Account = {
  email: string;
  username: string;
  password: string;
  type: 'IMAP' | 'POP';
  serverIncoming: string;
  serverOutgoing: string;
};

export type Rule = {
  name: string;
  conditions: {
    mail: {
      type: 'include' | 'exclude';
      area: 'from' | 'to' | 'subject' | 'body';
      match: 'startsWith' | 'endsWith' | 'contains' | 'is';
      query: string;
    }[];
    time: {
      type: 'before' | 'after';
      time: string;
    }[];
  };
  notify: {
    type: 'immediately' | 'every' | 'at';
    time: string;
  };
};

export type DataContextType = {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
};
