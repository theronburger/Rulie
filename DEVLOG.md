
# Basic setup


## CSS Relative Color Syntax
https://www.w3.org/TR/css-color-5/#relative-colors
```css
html { --bg-color: blue; }
.overlay {
  background: rgb(from var(--bg-color) r g b / 80%);
}
```


Settings menu trigger madness :

To achieve this, you can use a technique called "prop drilling", where you pass down the `trigger` prop from the `Settings` component to the `Menu` component via its props, and then render the trigger button in the `Menu` component.

Here's an example of how you can implement this:

```typescript
// App.js
import React from 'react';
import Menu from './Menu';
import Settings from './Settings';

function App() {
  return (
    <div>
      <Menu />
      <Settings />
    </div>
  );
}

export default App;

// Settings.js
import React, { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

function Settings({ trigger }) {
  const triggerRef = useRef(null);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={triggerRef}>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          {/* Dialog content */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Settings;

// Menu.js
import React from 'react';
import Settings from './Settings';

function Menu() {
  const triggerButton = <button>Open Settings</button>;

  return (
    <div>
      {/* Other menu items */}
      <Settings trigger={triggerButton} />
    </div>
  );
}

export default Menu;
```

In this example, the `triggerButton` element is defined in the `Menu` component, and passed down to the `Settings` component as a prop. The `Settings` component uses this element as the trigger to open the dialog when clicked. The `Menu` component then renders the `Settings` component with the `trigger` prop passed down as a child element.

When the `trigger` element is clicked, the `Settings` component will open the dialog, and display the content specified inside the `Dialog.Content` component.