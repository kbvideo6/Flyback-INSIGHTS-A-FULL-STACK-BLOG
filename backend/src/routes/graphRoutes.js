// ─── Graph Routes ───────────────────────────────────────
// Maps HTTP methods + URL paths → graph controller handlers.

import { Router } from "express";
import {
    getCanvasData,
    getCategories,
    getArticlesByCategory,
    getArticleBySlug,
    getTrends,
} from "../controllers/graphController.js";

const router = Router();

// Canvas — aggregated payload for the frontend graph view
router.get("/canvas", getCanvasData);

// Categories
router.get("/categories", getCategories);
router.get("/categories/:categoryId/articles", getArticlesByCategory);

// Articles
router.get("/articles/:slug", getArticleBySlug);

// Trends
router.get("/trends", getTrends);

export default router;
