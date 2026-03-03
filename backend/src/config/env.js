// ─── Environment Configuration ──────────────────────────
// Centralized env access with defaults.

import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};

export default env;
