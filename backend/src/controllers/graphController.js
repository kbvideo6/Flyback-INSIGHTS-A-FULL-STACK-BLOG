// ─── Graph Controller ───────────────────────────────────
// Translates HTTP requests into service calls and formats responses.

import * as graphService from "../services/graphService.js";

/**
 * GET /api/v1/graph/canvas
 * Returns the full canvas payload (hero, categories, trends).
 */
export async function getCanvasData(req, res, next) {
    try {
        const data = await graphService.getCanvasData();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/graph/categories
 * Returns all category nodes with counts.
 */
export async function getCategories(req, res, next) {
    try {
        const data = await graphService.getCategoryNodes();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/graph/categories/:categoryId/articles
 * Returns articles for a specific category.
 */
export async function getArticlesByCategory(req, res, next) {
    try {
        const { categoryId } = req.params;
        const data = await graphService.getArticlesByCategory(categoryId);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/graph/articles/:slug
 * Returns a single article by slug.
 */
export async function getArticleBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const data = await graphService.getArticleBySlug(slug);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/graph/trends
 * Returns active trends, optionally filtered by ?categoryId=
 */
export async function getTrends(req, res, next) {
    try {
        const { categoryId } = req.query;
        const data = await graphService.getActiveTrends(categoryId || null);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}
