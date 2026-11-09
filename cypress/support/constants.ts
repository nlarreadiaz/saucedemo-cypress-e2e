/** Explicit timeouts for scenarios that are known to be slower than usual. */
export const TIMEOUTS = {
  /** performance_glitch_user takes ~5s to log in by design. */
  slowLogin: 15_000,
} as const;
