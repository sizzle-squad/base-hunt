export function timeKey(dt: Date): string {
  return `${dt.getFullYear()}:${dt.getMonth()}:${dt.getDate()}:${dt.getHours()}`;
}

export function eqDateWithTimeKey(a: Date, b: Date): boolean {
  return timeKey(a) === timeKey(b);
}
