import 'tailwindcss/tailwind.css';
import Menu from './components/Menu';
import Settings from './components/Settings';
import { DataProvider } from './Context';

import './components/styles/input.css';
import './components/styles/button.css';
import './components/styles/form.css';
import './components/styles/dialog.css';
import './components/styles/dropdown.css';
import './components/styles/select.css';
import './App.css';
import RuleList from './components/RuleList';

export default function App() {
  return (
    <DataProvider>
      <div className="App">
        <Menu />
        <Settings />
        <RuleList />
      </div>
    </DataProvider>
  );
}
