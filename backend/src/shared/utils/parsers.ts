/**
 * Shared string and number parser helpers.
 */
export const parsePort = (val: string): number => {
  const parsed = parseInt(val, 10)
  return isNaN(parsed) ? 3001 : parsed
}
