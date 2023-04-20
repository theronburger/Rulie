import './App.css';
import 'tailwindcss/tailwind.css';
import Menu from './components/Menu';
import Settings from './components/Settings';

export default function App() {
  return (
    <div className="App">
      <Menu />
      <Settings />
    </div>
  );
}
