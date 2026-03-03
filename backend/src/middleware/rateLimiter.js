// ─── Rate Limiters ─────────────────────────────────────
// Two separate limiters:
//   publicLimiter  — applied to all public API routes     (100 req / 15 min)
//   adminLimiter   — applied to all /api/v1/admin routes  ( 20 req / 15 min)

import rateLimit from "express-rate-limit";

const windowMs = 15 * 60 * 1000; // 15 minutes

/**
 * publicLimiter
 * Applied to public graph + newsletter routes.
 */
export const publicLimiter = rateLimit({
    windowMs,
    max: 100,
    standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests. Please try again in 15 minutes.",
    },
});

/**
 * adminLimiter
 * Applied to all /api/v1/admin/* routes.
 * Stricter to reduce brute-force / scraping risk.
 */
export const adminLimiter = rateLimit({
    windowMs,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many admin requests. Please slow down and try again.",
    },
});
