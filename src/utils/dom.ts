/** Extracts the leading numeric value from a CSS unit string, e.g. "16px" → 16. */
export function parseUnitValue(value: string): number {
  return Number(value.match(/\d+/)?.[0] ?? 0);
}

/** @deprecated Use parseUnitValue instead. */
export const tripUnit = parseUnitValue;
