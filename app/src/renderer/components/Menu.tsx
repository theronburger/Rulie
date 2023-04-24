import * as Toolbar from '@radix-ui/react-toolbar';
import { GearIcon } from '@radix-ui/react-icons';
import Settings from './Settings';
import './Menu.css';

function Menu() {
  const triggerButton = (
    <Toolbar.Button className="ToolbarButton" style={{ marginLeft: 'auto' }}>
      <GearIcon />
    </Toolbar.Button>
  );
  return (
    <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
      <Settings trigger={triggerButton} />
    </Toolbar.Root>
  );
}

export default Menu;
