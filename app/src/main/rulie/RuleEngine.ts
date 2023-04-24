/* eslint-disable lines-between-class-members, class-methods-use-this, no-console */
import ElectronStore from 'electron-store';
import { IRule, IRuleFilter, IRuleTimeframe, ITime } from './types/rules';
import { IMail } from './types/mail';

class RuleEngine {
  private ruleStore: ElectronStore;
  private rules: IRule[];

  constructor() {
    // Initialize ruleStore
    this.ruleStore = new ElectronStore({
      name: 'ruleStore',
      defaults: {
        rules: [],
      },
    });
    // Initialize rules
    this.rules = this.ruleStore.get('rules', []) as IRule[];
  }

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

  public check(mail: IMail): IRule[] {
    // Check mail against rules and return matched rules
    console.log(`🔎 Checking mail ${mail.id} against rules`);
    return this.rules.filter((rule) => {
      return (
        // reduce the filters by checking each filter with matchesFilter
        rule.filters.reduce((acc, filter) => {
          return acc || this.matchesFilter(filter, mail);
        }, true) &&
        // reduce the timeframes by checking each timeframe with matchesTimeframe
        rule.timeframes.reduce((acc, timeframe) => {
          return acc || this.matchesTimeframe(timeframe);
        }, true)
      );
    });
  }

  // Private methods
  private matchesFilter(filter: IRuleFilter, mail: IMail): boolean {
    // Check if a mail matches a filter
    console.log(`\tagainst filter ${JSON.stringify(filter)}`);
    const searchField =
      (mail[filter.field as keyof IMail] as string | undefined | null) ?? '';
    switch (filter.match) {
      case 'is':
        return searchField === filter.query;
      case 'contains':
        return searchField.includes(filter.query);
      case 'startsWith':
        return searchField.startsWith(filter.query);
      case 'endsWith':
        return searchField.endsWith(filter.query);
      default:
        console.warn('💥 Unknown filter match type');
        return false;
    }
  }
  private matchesTimeframe(timeframe: IRuleTimeframe): boolean {
    // Check if a mail matches a timeframe
    function parseTime(time: ITime): Date {
      const date = new Date();
      const [hours, minutes] =
        typeof time === 'string' ? time.split(':').map(Number) : [time, 0];
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    const currentTime = new Date();

    switch (timeframe.type) {
      case 'before':
        return currentTime < parseTime(timeframe.time as ITime);
      case 'after':
        return currentTime > parseTime(timeframe.time as ITime);
      case 'between':
      case 'notBetween': {
        const [startTime, endTime] = (timeframe.time as [ITime, ITime]).map(
          parseTime
        );
        const isBetween = currentTime >= startTime && currentTime <= endTime;
        return timeframe.type === 'between' ? isBetween : !isBetween;
      }
      default:
        console.warn('💥 Unknown timeframe type');
        return false;
    }
  }
}

export default RuleEngine;
