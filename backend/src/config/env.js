// ─── Environment Configuration ──────────────────────────
// Centralized env access with defaults.

import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
    // Supabase Auth
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Cloudflare R2
    R2_ACCESS_KEY_ID:     process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME:       process.env.R2_BUCKET_NAME,
    R2_ENDPOINT:          process.env.R2_ENDPOINT,
    R2_PUBLIC_URL:        process.env.R2_PUBLIC_URL,
};

export default env;
