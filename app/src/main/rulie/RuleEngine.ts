/* eslint-disable lines-between-class-members, class-methods-use-this */
import ElectronStore from 'electron-store';
import { ImapMessage } from 'node-imap';
import { IRule, IRuleFilter, IRuleTimeframe } from './types/rules';

class RuleEngine {
  private ruleStore: ElectronStore;
  private rules: IRule[];

  constructor() {
    // Initialize ruleStore
    this.ruleStore = new ElectronStore({
      name: 'ruleStore',
      defaults: {
        rules: [
          {
            id: '1',
            name: 'Work Colleagues',
            filters: [
              {
                type: 'include',
                field: 'from',
                match: 'endsWith',
                query: '@domain.com',
              },
              {
                type: 'exclude',
                field: 'from',
                match: 'is',
                query: 'bigboss@domain.com',
              },
            ],
            timeframes: [
              { type: 'after', time: '9:00' },
              { type: 'before', time: '17:00' },
            ],
            notificationSchedule: { type: 'every', time: '2h' },
          },
        ],
      },
    });
    // Initialize rules
    this.ruleStore.clear()
    this.rules = this.ruleStore.get('rules', []) as IRule[];
  }

  // Public methods
  public createRule(rule: IRule): Promise<boolean> {
    // Create a new rule
    return new Promise((resolve) => {
      this.rules.push(rule);
      this.ruleStore.set('rules', this.rules);
      resolve(true);
    });
  }

  public updateRule(rule: IRule): Promise<boolean> {
    // Update an existing rule
    return new Promise((resolve, reject) => {
      const ruleIndex = this.rules.findIndex((r) => r.id === rule.id);
      if (ruleIndex === -1) {
        reject(new Error('Rule not found'));
      }
      this.rules[ruleIndex] = rule;
      this.ruleStore.set('rules', this.rules);
      resolve(true);
    });
  }

  public deleteRule(ruleId: string): Promise<boolean> {
    // Delete a rule
    return new Promise((resolve, reject) => {
      const ruleIndex = this.rules.findIndex((r) => r.id === ruleId);
      if (ruleIndex === -1) {
        reject(new Error('Rule not found'));
      }
      this.rules.splice(ruleIndex, 1);
      this.ruleStore.set('rules', this.rules);
      resolve(true);
    });
  }

  public listRules(): IRule[] {
    // List all rules
    return this.rules;
  }

  public check(mail: ImapMessage): IRule[] {
    // Check mail against rules and return matched rules
    return this.rules.filter((rule) => {
      return (
        this.matchesFilter(rule.filter, mail) &&
        this.matchesTimeframe(rule.timeframe, mail)
      );
    });
  }

  // Private methods
  private matchesFilter(filter: IRuleFilter, mail: ImapMessage): boolean {
    // Check if a mail matches a filter
  }

  private matchesTimeframe(
    timeframe: IRuleTimeframe,
    mail: ImapMessage
  ): boolean {
    // Check if a mail matches a timeframe
  }
}

export default RuleEngine;
