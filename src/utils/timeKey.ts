import {
  format,
  addHours,
  roundToNearestMinutes,
  addMinutes,
  parse,
  nextDay,
  startOfTomorrow,
  endOfDay,
  startOfDay,
  addDays,
} from 'date-fns';

const DATE_KEY_FORMAT = 'yyyy:MM:dd';

export function timeKey(dt: Date): string {
  return format(dt, DATE_KEY_FORMAT);
}

export function eqDateWithTimeKey(a: Date, b: Date): boolean {
  return timeKey(a) === timeKey(b);
}

export function nextEligibleTime(a: Date): Date {
  const b = startOfDay(a);
  const r = addDays(b, 1);
  return r;
}
