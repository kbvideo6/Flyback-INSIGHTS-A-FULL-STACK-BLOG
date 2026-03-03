// ─── Supabase JWT Auth Middleware ──────────────────────
// Verifies the Bearer token from the Authorization header
// using the Supabase service-role client.
// On success: attaches req.user and calls next().
// On failure: returns 401 Unauthorized.

import { createClient } from "@supabase/supabase-js";
import env from "../config/env.js";

// Service-role client — bypasses RLS, only used server-side for token verification
const supabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

/**
 * requireAuth — verifies the Supabase JWT and attaches req.user.
 * Use on any route that requires an authenticated admin session.
 */
export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed. Expected: Bearer <token>",
            });
        }

        const token = authHeader.slice(7); // strip "Bearer "

        const { data, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        req.user = data.user; // { id, email, role, ... }
        next();
    } catch (err) {
        next(err); // forward unexpected errors to the global error handler
    }
}
