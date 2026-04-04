/**
 * Comma-separated list in ADMIN_ALLOWED_EMAILS (e.g. Vercel env).
 * Only these emails can use /admin and mutating APIs. Compared case-insensitively.
 */
export function parseAdminAllowlist(): Set<string> {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const set = parseAdminAllowlist();
  if (set.size === 0) {
    return false;
  }
  return set.has(email.trim().toLowerCase());
}
