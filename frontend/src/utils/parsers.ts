/**
 * Data string, CSV, and health log parser utilities.
 */
export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}
