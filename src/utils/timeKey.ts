import {
  format,
  addHours,
  roundToNearestMinutes,
  addMinutes,
  parse,
  nextDay,
  startOfTomorrow,
} from 'date-fns';

const DATE_KEY_FORMAT = 'yyyy:MM:dd';

export function timeKey(dt: Date): string {
  return format(dt, DATE_KEY_FORMAT);
}

export function eqDateWithTimeKey(a: Date, b: Date): boolean {
  return timeKey(a) === timeKey(b);
}

export function nextEligibleTime(a: Date): Date {
  return startOfTomorrow();
}
