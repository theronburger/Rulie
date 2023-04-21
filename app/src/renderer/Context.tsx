import { Account, DataContextType, Rule } from 'datatypes';
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const DataContext = createContext<DataContextType>({} as DataContextType);

function DataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      email: 'pftburger@mailbox.org',
      username: 'pftburger@mailbox.org',
      password: 'notARealPass',
      type: 'IMAP',
      serverIncoming: '',
      serverOutgoing: '',
    },
  ]);
  const [rules, setRules] = useState<Rule[]>([
    {
      name: 'Work Colleagues',
      conditions: {
        mail: [
          {
            type: 'include',
            area: 'from',
            match: 'endsWith',
            query: '@domain.com',
          },
          {
            type: 'exclude',
            area: 'from',
            match: 'is',
            query: 'bigboss@domain.com',
          },
        ],
        time: [
          { type: 'after', time: '9:00' },
          { type: 'before', time: '17:00' },
        ],
      },
      notify: { type: 'every', time: '2h' },
    },
  ]);

  const dataContextValue = useMemo(
    () => ({ accounts, setAccounts, rules, setRules }),
    [accounts, setAccounts, rules, setRules]
  );

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  const dataContext = useContext(DataContext);
  if (dataContext === undefined) {
    throw new Error('DataContext must be descendant of DataProvider');
  }
  return dataContext;
}

export { DataProvider as EventProvider, useData };
