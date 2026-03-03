// ─── Global Error Handler ──────────────────────────────
// Must be mounted LAST in app.js (after all routes).
// Catches any error passed via next(err).

import env from "../config/env.js";

/**
 * notFoundHandler
 * Catches requests that didn't match any route and returns 404.
 * Mount immediately after all route registrations.
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}

/**
 * errorHandler
 * Express 4-argument error middleware — catches all errors forwarded via next(err).
 * Mount as the very last middleware in app.js.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    console.error("Unhandled Error:", err);

    const statusCode = err.statusCode || 500;
    const message =
        env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV !== "production" && { stack: err.stack }),
    });
}
