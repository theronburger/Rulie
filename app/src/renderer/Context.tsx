import { IpcRenderer } from 'electron';
import { IIpcEvent, createIpcHandler } from 'lib/ipc';
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
  // TODO: Create custom hook for IPC based state
  const [accounts, setAccounts] = useState<IMailAccount[]>([]);
  const [rules, setRules] = useState<IRule[]>([]);
  const [editingRuleId, setEditingRuleId] = useState<string>('');

  useEffect(() => {
    window.electron.ipcRenderer.on('getAccounts', (arg) => {
      setAccounts(arg as IMailAccount[]);
    });
    window.electron.ipcRenderer.send('getAccounts');

    window.electron.ipcRenderer.on('getRules', (arg) => {
      setRules(arg as IRule[]);
    });
    window.electron.ipcRenderer.send('getRules');
  }, []);

  const dataContextValue = useMemo(
    () => ({
      accounts,
      setAccounts,
      rules,
      setRules,
      editingRuleId,
      setEditingRuleId,
    }),
    [accounts, setAccounts, rules, setRules, editingRuleId, setEditingRuleId]
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
