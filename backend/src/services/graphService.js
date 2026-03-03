// ─── Graph Service ──────────────────────────────────────
// Data access layer for the knowledge-graph canvas.
// Rule: NO Express imports. This module only talks to the DB.

import prisma from "../config/db.js";

/**
 * Get the "hero" node — the single featured article
 * displayed prominently on the canvas.
 */
export async function getHeroNode() {
    return prisma.article.findFirst({
        where: { isFeatured: true, isPublished: true },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
    });
}

/**
 * Get all categories with their article and trend counts.
 * Used to render the top-level nodes on the canvas.
 */
export async function getCategoryNodes() {
    return prisma.category.findMany({
        include: {
            _count: {
                select: { articles: true, trends: true },
            },
        },
        orderBy: { name: "asc" },
    });
}

/**
 * Get published articles for a specific category.
 * Returns lightweight data for canvas node rendering.
 */
export async function getArticlesByCategory(categoryId) {
    return prisma.article.findMany({
        where: {
            categoryId: parseInt(categoryId, 10),
            isPublished: true,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            imageUrl: true,
            author: true,
            publishedAt: true,
            views: true,
            category: { select: { name: true, color: true } },
        },
        orderBy: { publishedAt: "desc" },
    });
}

/**
 * Get a single article by its slug — full content.
 */
export async function getArticleBySlug(slug) {
    return prisma.article.findUnique({
        where: { slug },
        include: { category: true },
    });
}

/**
 * Get active trends, optionally filtered by category.
 * Sorted by score descending (most relevant first).
 */
export async function getActiveTrends(categoryId = null) {
    const where = { isActive: true };
    if (categoryId) where.categoryId = parseInt(categoryId, 10);

    return prisma.trend.findMany({
        where,
        include: { category: { select: { name: true, color: true } } },
        orderBy: { score: "desc" },
    });
}

/**
 * Assemble the full canvas payload — hero, categories, and trends.
 * This is the primary data source for the frontend graph view.
 */
export async function getCanvasData() {
    const [hero, categories, trends] = await Promise.all([
        getHeroNode(),
        getCategoryNodes(),
        getActiveTrends(),
    ]);

    return { hero, categories, trends };
}
