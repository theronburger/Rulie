import { DataContextType } from 'main/rulie/types/context';
import { IMailAccount } from 'main/rulie/types/mail';
import { IRule } from 'main/rulie/types/rules';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const DataContext = createContext<DataContextType>({} as DataContextType);

function DataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<IMailAccount[]>([]);
  const [rules, setRules] = useState<IRule[]>([]);

  // TODO: Create a generic handler for requesting and storing data shared via ipc
  useEffect(() => {
    window.electron.ipcRenderer.once('getAccounts', (arg) => {
      setAccounts(arg as IMailAccount[]);
    });
    window.electron.ipcRenderer.sendMessage('getAccounts');

    window.electron.ipcRenderer.once('getRules', (arg) => {
      setRules(arg as IRule[]);
    });
    window.electron.ipcRenderer.sendMessage('getRules');
  }, []);

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

export { DataProvider, useData };
