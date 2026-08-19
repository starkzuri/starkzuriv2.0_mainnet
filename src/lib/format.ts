/**
 * Shared formatting helpers.
 *
 * These were previously copy-pasted across components with small divergences.
 * The divergences are preserved here as explicit options rather than collapsed,
 * so no rendered output changes — see `formatNumber`.
 */

/**
 * Abbreviate a number to K/M.
 *
 * @param locale when true, the sub-1000 fallback uses `toLocaleString()` so
 *   1234 renders as "1,234". When false it uses `toString()` -> "1234".
 *   Rewards has always used the locale form; PredictionCard and MarketDetail
 *   have always used the plain form. Keep passing what each call site used.
 */
export const formatNumber = (
  num: number | string,
  { locale = false }: { locale?: boolean } = {},
): string => {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return locale ? n.toLocaleString() : n.toString();
};

/**
 * Normalize a Starknet address to the canonical lowercase, zero-padded
 * 0x + 64 hex-digit form. Returns "" for empty input.
 *
 * This is normalization for comparison and links — for display truncation use
 * the TruncatedAddress component instead.
 */
export const padAddress = (addr: string): string => {
  if (!addr) return "";
  let hex = addr.toLowerCase();
  if (!hex.startsWith("0x")) hex = "0x" + hex;
  while (hex.length < 66) hex = "0x0" + hex.substring(2);
  return hex;
};

/** Deterministic fallback avatar for an address with no profile picture. */
export const avatarFor = (seed: string): string =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
