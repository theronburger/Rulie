import { IMailAccount } from 'main/rulie/types/mail';
import { IRule } from 'main/rulie/types/rules';
import React from 'react';

export type DataContextType = {
  accounts: IMailAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<IMailAccount[]>>;
  rules: IRule[];
  setRules: React.Dispatch<React.SetStateAction<IRule[]>>;
  editingRuleId: string;
  setEditingRuleId: React.Dispatch<React.SetStateAction<string>>;
};
