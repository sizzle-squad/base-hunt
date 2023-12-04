import { format } from 'date-fns';

const DATE_KEY_FORMAT = process.env.DATE_KEY_FORMAT || 'yyyy:MM:dd:HH';
export function timeKey(dt: Date): string {
  return format(dt, DATE_KEY_FORMAT);
}

export function eqDateWithTimeKey(a: Date, b: Date): boolean {
  return timeKey(a) === timeKey(b);
}
