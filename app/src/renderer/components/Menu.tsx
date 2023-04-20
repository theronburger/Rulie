import * as Toolbar from '@radix-ui/react-toolbar';
import { GearIcon } from '@radix-ui/react-icons';
import './Menu.css';

function Menu() {
  return (
    <Toolbar.Root className="ToolbarRoot" aria-label="Formatting options">
      <Toolbar.Button className="ToolbarButton" style={{ marginLeft: 'auto' }}>
        <GearIcon />
      </Toolbar.Button>
    </Toolbar.Root>
  );
}

export default Menu;
