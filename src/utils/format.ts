/** Formats a distance in kilometres to a human-readable string, or null if unavailable. */
export function formatDistance(km: number | null | undefined): string | null {
  if (km == null || km <= 0) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

/** Extracts the first (display) name from a full name string. */
export function getFirstName(fullName: string | null | undefined): string {
  return fullName?.split(' ').pop() ?? 'bạn';
}
