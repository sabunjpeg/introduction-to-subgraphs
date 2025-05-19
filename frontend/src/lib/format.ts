export function formatUSDC(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    // in millions, e.g. 12345678 → “12.3 M”
    return `${(value / 1_000_000).toFixed(1)} M`;
  }
  // else normal with commas: e.g. 12345 → “12 ,345”
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}