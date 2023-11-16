export function sortWithBigInt(a: bigint, b: bigint) {
  return a < b ? -1 : a > b ? 1 : 0;
}
