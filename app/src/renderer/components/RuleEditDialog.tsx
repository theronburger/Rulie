import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IRule } from 'main/rulie/types/rules';
import { useData } from 'renderer/Context';
import { RuleEdit } from './RuleEdit';

import './RuleEditDialog.css';

function RuleEditDialog() {
  // const triggerRef = useRef<React.ReactNode>(null);
  const { rules, editingRuleId, setEditingRuleId } = useData();
  const editingRule = rules.find((rule: IRule) => rule.id === editingRuleId);

  return (
    <Dialog.Root
      open={editingRuleId !== ''}
      onOpenChange={(e) => {
        !e && setEditingRuleId('');
      }}
    >
      {/* <Dialog.Trigger asChild={triggerRef !== null}>{trigger}</Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay className="RuleEditDialogOverlay" />
        <Dialog.Content className="RuleEditDialogContent">
          {editingRule && (
            <RuleEdit
              rule={
                rules.find((rule: IRule) => rule.id === editingRuleId) as IRule
              }
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default RuleEditDialog;
