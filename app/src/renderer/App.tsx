import Menu from './components/Menu';
import Settings from './components/Settings';
import { DataProvider, useData } from './Context';

import 'tailwindcss/tailwind.css';
import './components/styles/input.css';
import './components/styles/button.css';
import './components/styles/form.css';
import './components/styles/dialog.css';
import './components/styles/dropdown.css';
import './components/styles/select.css';
import './App.css';
import RuleList from './components/RuleList';
import RuleEditDialog from './components/RuleEditDialog';
import Welcome from './components/Welcome';

export default function App() {
  return (
    <DataProvider>
      <div className="App relative">
        <Menu />
        <Settings />
        <RuleEditDialog />
        <RuleList />
        <Welcome />
      </div>
    </DataProvider>
  );
}
