/**
 * For a pair of strings A and B, find a string X such that A < X < B when sorted
 * alphabetically, where X is roughly halfway between A and B. Only supports hex
 * strings.
 *
 * Arithmetic operations must be performed using BigInts to avoid overflow.
 */

const hexToBigInt = (hex: string | null, length: number): bigint | null => {
  if (hex === null) return null;

  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error(`Invalid hex string: ${hex}`);
  }

  return BigInt(`0x${hex.padEnd(length, '0')}`);
};

const bigIntToHex = (n: bigint, length: number): string =>
  n.toString(16).padStart(length, '0');

export const findOrderStringBetween = (
  before: string | null,
  after: string | null
): string => {
  // Pad hex strings to the same length and convert to BigInt
  let length = Math.max(before?.length ?? 0, after?.length ?? 0);

  const beforeInt = hexToBigInt(before, length) ?? BigInt(0);
  const afterInt = hexToBigInt(after, length) ?? BigInt(16) ** BigInt(length);

  // Get the numeric midpoint, rounding down
  let midpointInt = beforeInt + (afterInt - beforeInt) / BigInt(2);

  const conflictsWithBefore = midpointInt === beforeInt;

  /**
   * Avoid orders that end in zero, since these can result in a pair of orders
   * with no valid midpoint, such as 0x100 and 0x1000.
   */
  const endsInZero = midpointInt % BigInt(16) === BigInt(0);

  /**
   * If the midpoint conflicts with the before value or is invalid, append an
   * '8' to the hex string.
   */
  if (conflictsWithBefore || endsInZero) {
    midpointInt *= BigInt(16);
    midpointInt += BigInt(8);
    length++;
  }

  return bigIntToHex(midpointInt, length);
};
