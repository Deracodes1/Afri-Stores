/**
 * Get initials from a full name
 * Examples:
 *   "John Okoro" → "JO"
 *   "Mary" → "MA"
 *   "Ahmed Hassan Ali" → "AA"
 */
export function getInitials(name: string): string {
  if (!name) return '';

  const names = name.trim().split(' ');

  // If only one name, use first 2 letters
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }

  // Multiple names - use first letter of first and last name
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}
