import React from 'react';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

interface SelectMenuProps {
  options: string[];
  placeholder: string;
  areaLabel: string;
  // eslint-disable-next-line no-unused-vars
  onValueChange?: (value: string) => void;
  className: string;
}

function SelectMenu({
  options,
  placeholder,
  areaLabel,
  onValueChange,
  className,
}: SelectMenuProps) {
  return (
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger
        className={`${className} SelectTrigger`}
        aria-label={areaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            {/* TODO: Check out the forwardRef way of doing this in the RadixUI docs > https://www.radix-ui.com/docs/primitives/components/select */}
            {options.map((item) => (
              <Select.Item value={item} className="SelectItem">
                <Select.ItemText>{item}</Select.ItemText>
                <Select.ItemIndicator className="SelectItemIndicator">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default SelectMenu;
