/* eslint-disable react/jsx-pascal-case */
/* eslint-disable import/prefer-default-export */
import { v4 as uuidv4 } from 'uuid';
import { IRule } from 'main/rulie/types/rules';
import { useState } from 'react';
import { useData } from 'renderer/Context';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Icons } from './ui/icons';

interface RuleListItemProps {
  rule: IRule;
}

export function RuleEdit({ rule }: RuleListItemProps) {
  // TODO: create a IPC Hook!
  const [localRule, setLocalRule] = useState(rule);
  const { setEditingRuleId } = useData();

  const save = () => {
    window.electron.ipcRenderer.send('updateRule', localRule);
    window.electron.ipcRenderer.send('getRules'); // Seems like a hack. Firing get rules updates all components subscribed to getRules
  };

  const addFilter = () => {
    setLocalRule({
      ...localRule,
      filters: [
        ...localRule.filters,
        {
          id: uuidv4(),
          field: 'from',
          match: 'contains',
          query: '',
        },
      ],
    });
  };

  const removeFilter = (id: string) => {
    setLocalRule({
      ...localRule,
      filters: localRule.filters.filter((filter) => filter.id !== id),
    });
  };

  const updateFilter = (id: string, field: string, value: string) => {
    setLocalRule({
      ...localRule,
      filters: localRule.filters.map((filter) => {
        if (filter.id === id) {
          return {
            ...filter,
            [field]: value,
          };
        }
        return filter;
      }),
    });
  };

  const addTimeframe = () => {
    setLocalRule({
      ...localRule,
      timeframes: [
        ...localRule.timeframes,
        {
          id: uuidv4(),
          type: 'before',
          time: '',
        },
      ],
    });
  };

  const removeTimeframe = (id: string) => {
    setLocalRule({
      ...localRule,
      timeframes: localRule.timeframes.filter(
        (timeframe) => timeframe.id !== id
      ),
    });
  };

  const updateTimeframe = (id: string, field: string, value: string) => {
    setLocalRule({
      ...localRule,
      timeframes: localRule.timeframes.map((timeframe) => {
        if (timeframe.id === id) {
          return {
            ...timeframe,
            [field]: value,
          };
        }
        return timeframe;
      }),
    });
  };

  // Note : The ONLY way to navigate this is using the minimize code thingy on the left
  return (
    <Card className="mx-auto bg-white w-full ">
      <CardHeader>
        <CardTitle>{localRule.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Accordion className="" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Rule name</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="A rather nice rule"
                  defaultValue={localRule.name}
                  onChange={(e) =>
                    setLocalRule({ ...localRule, name: e.target.value })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Filters</AccordionTrigger>
            <AccordionContent>
              <div className="grid">
                {localRule.filters.map((filter, i) => (
                  <div className="grid grid-cols-12 gap-4" key={filter.id}>
                    <div className="grid col-span-3 gap-2">
                      {i === 0 && <Label htmlFor="field">Field</Label>}
                      <Select
                        defaultValue={filter.field}
                        onValueChange={(e) =>
                          updateFilter(filter.id, 'field', e)
                        }
                      >
                        <SelectTrigger id="field">
                          <SelectValue placeholder="field" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="from">from</SelectItem>
                          <SelectItem value="to">to</SelectItem>
                          <SelectItem value="subject">subject</SelectItem>
                          <SelectItem value="body">body</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid col-span-3 gap-2">
                      {i === 0 && <Label htmlFor="match">Match Type</Label>}
                      <Select
                        defaultValue={filter.match}
                        onValueChange={(e) =>
                          updateFilter(filter.id, 'match', e)
                        }
                      >
                        <SelectTrigger id="match">
                          <SelectValue placeholder="match" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="contains">contains</SelectItem>
                          <SelectItem value="is">is</SelectItem>
                          <SelectItem value="startsWith">
                            starts with
                          </SelectItem>
                          <SelectItem value="endsWith">ends with</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid col-span-5 gap-2">
                      {i === 0 && <Label htmlFor="query">Query</Label>}
                      <Input
                        id="query"
                        placeholder="something to search for"
                        defaultValue={filter.query}
                        onChange={(e) =>
                          updateFilter(filter.id, 'query', e.target.value)
                        }
                      />
                    </div>
                    <div className="grid col-span-1 gap-2">
                      {i === 0 && <Label htmlFor="trash"> </Label>}
                      <button
                        className="flex items-center justify-center -mt-4"
                        type="button"
                        onClick={() => removeFilter(filter.id)}
                      >
                        <Icons.trash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    className=" bg-black text-white font-bold w-2 py-2 px-4 rounded-full flex justify-center align-middle"
                    type="button"
                    onClick={addFilter}
                  >
                    +
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Time frames</AccordionTrigger>
            <AccordionContent>
              <div className="grid">
                {localRule.timeframes.map((timeframe, i) => (
                  <div className="grid grid-cols-12 gap-4" key={timeframe.id}>
                    <div className="grid col-span-3 gap-2">
                      {i === 0 && <Label htmlFor="field">Type</Label>}
                      <Select
                        defaultValue={timeframe.type}
                        onValueChange={(e) => {
                          updateTimeframe(timeframe.id, 'type', e);
                        }}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="before">before</SelectItem>
                          <SelectItem value="after">after</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid col-span-5 gap-2">
                      {i === 0 && <Label htmlFor="query">Time</Label>}
                      <Input
                        id="query"
                        type="time"
                        placeholder="something to search for"
                        defaultValue={timeframe.time}
                        onChange={(e) =>
                          updateTimeframe(timeframe.id, 'time', e.target.value)
                        }
                      />
                    </div>
                    <div className="grid col-span-1 gap-2">
                      {i === 0 && <Label htmlFor="trash"> </Label>}
                      <button
                        className="flex items-center justify-center -mt-4"
                        type="button"
                        onClick={() => removeTimeframe(timeframe.id)}
                      >
                        <Icons.trash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    className=" bg-black text-white font-bold w-2 py-2 px-4 rounded-full flex justify-center align-middle"
                    type="button"
                    onClick={addTimeframe}
                  >
                    +
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Notification Scheduling</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid col-span-1 gap-2">
                  <Label htmlFor="field">Type</Label>
                  <Select
                    defaultValue={rule.notificationSchedule.type}
                    onValueChange={(e) => {
                      setLocalRule({
                        ...localRule,
                        notificationSchedule: {
                          ...localRule.notificationSchedule,
                          type: e,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="immediately">immediately</SelectItem>
                      <SelectItem value="every">every</SelectItem>
                      <SelectItem value="at">at</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {localRule.notificationSchedule.type !== 'immediately' && (
                  <div className="grid col-span-1 gap-2">
                    <Label htmlFor="query">Time</Label>
                    <Input
                      id="query"
                      type="time"
                      placeholder="something to search for"
                      defaultValue={rule.notificationSchedule.time}
                      onChange={(e) =>
                        setLocalRule({
                          ...localRule,
                          notificationSchedule: {
                            ...localRule.notificationSchedule,
                            time: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between gap-20">
        <Button className="bg-black text-white w-1/2" onClick={save}>
          Save
        </Button>
        <Button
          className="bg-black text-white w-1/2"
          onClick={() => setEditingRuleId('')}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
