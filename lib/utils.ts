export const cn = (...classes: Array<string | false | null | undefined>): string => {
  return classes.filter(Boolean).join(' ');
};

export const clamp = (value: number, min = 0, max = Number.MAX_SAFE_INTEGER): number => {
  return Math.min(max, Math.max(min, value));
};
