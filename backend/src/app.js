// ─── Express Application ────────────────────────────────
// Configures middleware, mounts routes, and sets up error handling.

import express from "express";
import cors from "cors";
import env from "./config/env.js";
import mainRouter from "./routes/index.js";

const app = express();

// ─── Global Middleware ──────────────────────────────────

// CORS — allow requests from the React frontend
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Parse JSON request bodies (crucial for newsletter POST)
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ─── API Routes ─────────────────────────────────────────

app.use("/api/v1", mainRouter);

// ─── 404 Handler ────────────────────────────────────────

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ─── Global Error Handler ───────────────────────────────
// Must be the LAST middleware registered. Catches all unhandled errors.

app.use((err, req, res, next) => {
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
});

export default app;
