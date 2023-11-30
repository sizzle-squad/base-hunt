export function toBigInt(value: string | number): bigint | null {
    try {
      return BigInt(value);
    } catch (e) {
      return null;
    }
  }