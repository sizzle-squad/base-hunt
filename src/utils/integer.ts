export function isStringAnInteger(str: string): boolean {
  const num = parseInt(str, 10);

  // Check if the parsed number is a valid number and if it matches the original string
  return !isNaN(num) && num.toString() === str;
}
