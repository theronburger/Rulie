// self made drop in replacement for cn because I couldn't find it
const cn = (...classes: (string | boolean | undefined)[]) => {
  const uniqueClasses = new Set<string>();
  classes.forEach((cls) => {
    if (typeof cls === 'string') {
      cls.split(' ').forEach((c) => {
        uniqueClasses.add(c);
      });
    }
  });
  return [...uniqueClasses].join(' ');
};

// aware of this, but want to keep Shadcn's code as is
// eslint-disable-next-line import/prefer-default-export
export { cn };
