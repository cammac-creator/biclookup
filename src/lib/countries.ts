// Uses Node.js built-in Intl API — no hardcoded list needed
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function getCountryName(code: string): string | null {
  if (!code || code.length !== 2) return null;
  try {
    const name = displayNames.of(code.toUpperCase());
    // Intl returns the input code when unknown — treat as null
    return name && name !== code.toUpperCase() ? name : null;
  } catch {
    return null;
  }
}
