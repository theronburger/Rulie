/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useData } from 'renderer/Context';
import { cn } from 'lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import RuleListItem from './RuleListItem';

interface RuleListProps {
  className?: string;
}

export default function RuleList({ className, ...props }: RuleListProps) {
  const { rules, setEditingRuleId } = useData();
  const [deleteRuleIdConfirm, setDeleteRuleIdConfirm] = React.useState('');

  // TODO: For some reason the card components are not firing the onClick event, so excuse the hacky solution
  const clickSorter = (e: any, ruleId: string) => {
    if (e.target.localName === 'div') {
      setEditingRuleId(ruleId);
    } else if (e.target.localName === 'svg') {
      console.log('trash');
      setDeleteRuleIdConfirm(ruleId);
    }
  };

  const deleteRule = (ruleId: string) => {
    window.electron.ipcRenderer.send('deleteRule', [ruleId]);
    window.electron.ipcRenderer.send('getRules');
    setDeleteRuleIdConfirm('');
  };

  const addRule = () => {
    window.electron.ipcRenderer.send('createRule', {
      id: uuidv4(),
      name: 'New Rule',
      filters: [],
      timeframes: [],
      notificationSchedule: {
        type: 'immediately',
        time: '',
      },
    });
    window.electron.ipcRenderer.send('getRules');
  };

  return (
    <div>
      <div className="m-5 flex flex-col gap-5">
        {rules.map((rule) => (
          <div onClick={(e) => clickSorter(e, rule.id)} key={rule.id}>
            <RuleListItem
              className={cn('', className)}
              rule={rule}
              {...props}
            />
          </div>
        ))}
        <div className="flex flex-row justify-center">
          <button
            className="mt-8 bg-black text-white font-bold w-2 py-2 px-4 rounded-full flex justify-center align-middle"
            type="button"
            onClick={() => addRule()}
          >
            +
          </button>
        </div>
      </div>
      <Dialog.Root
        open={deleteRuleIdConfirm !== ''}
        onOpenChange={() => setDeleteRuleIdConfirm('')}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Woa there!</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              {`Are you sure  you want to delete the ${
                rules.find((rule) => rule.id === deleteRuleIdConfirm)?.name
              } rule?`}
            </Dialog.Description>
            <div className="flex flex-row justify-between gap-2">
              <button
                onClick={() => deleteRule(deleteRuleIdConfirm)}
                className="Button black"
                type="button"
              >
                Yea, delete it
              </button>
              <button
                onClick={() => setDeleteRuleIdConfirm('')}
                className="Button black"
                type="button"
              >
                Oh! no dont do that!
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
