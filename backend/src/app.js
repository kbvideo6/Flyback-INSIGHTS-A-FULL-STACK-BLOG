// ─── Express Application ────────────────────────────────
// Configures middleware, mounts routes, and sets up error handling.

import express from "express";
import cors from "cors";
import env from "./config/env.js";
import mainRouter from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

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

// ─── 404 + Global Error Handlers ───────────────────────
// Defined in middleware/errorHandler.js and mounted last.

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
