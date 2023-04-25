/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-props-no-spreading */
import { IRule } from 'main/rulie/types/rules';
import { cn } from 'lib/utils';
import generateDescription from 'lib/textHelpers';
import { useState } from 'react';
import { useData } from 'renderer/Context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Icons } from './ui/icons';

interface RuleListItemProps {
  className?: string;
  rule: IRule;
}

export default function RuleListItem({
  className,
  rule,
  ...props
}: RuleListItemProps) {
  const [hover, setHover] = useState(true);
  const { setEditingRuleId } = useData();
  return (
    <Card
      className={cn(
        `relative bg-white w-[600px] ${
          hover ? 'h-14' : 'h-30'
        } transition-all duration-200`,
        className
      )}
      {...props}
      onMouseEnter={() => setHover(false)}
      onMouseLeave={() => setHover(true)}
    >
      <div className="absolute w-full h-full flex justify-end items-center pr-5">
        <Icons.trash className="" />
      </div>

      <CardHeader className="absolute -top-1">
        <CardTitle>
          <div
            className={`card-content ${
              hover ? 'opacity-100 ' : 'opacity-0'
            } transition-opacity  duration-200`}
          >
            {rule.name}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 mt-5 mr-20">
        <div
          className={`card-content ${
            hover ? 'opacity-0 ' : 'opacity-100'
          } transition-opacity  duration-200`}
        >
          {generateDescription(rule)}
        </div>
      </CardContent>
    </Card>
  );
}
