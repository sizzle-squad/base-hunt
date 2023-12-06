import {
  format,
  addHours,
  roundToNearestMinutes,
  addMinutes,
  parse,
} from 'date-fns';

const DATE_KEY_FORMAT = process.env.DATE_KEY_FORMAT || 'yyyy:MM:dd:HH';
const ADD_HOURS = parseInt(process.env.DATE_ADD_HOURS as string) || 1;

export function timeKey(dt: Date): string {
  return format(dt, DATE_KEY_FORMAT);
}

export function eqDateWithTimeKey(a: Date, b: Date): boolean {
  return timeKey(a) === timeKey(b);
}

export function nextEligibleTime(a: Date): Date {
  const b = addHours(a, ADD_HOURS);
  b.setHours(0);
  b.setMinutes(0);
  b.setSeconds(0);
  b.setMilliseconds(0);
  return b;
}
