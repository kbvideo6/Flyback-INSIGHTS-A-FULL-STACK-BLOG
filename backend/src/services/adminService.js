// ─── Admin Service ──────────────────────────────────────
// Prisma data-access layer for the CMS admin panel.
// Rule: NO Express imports. This module only talks to the DB.

import prisma from "../config/db.js";

// ─── Articles ────────────────────────────────────────────

/**
 * List ALL articles (including unpublished drafts).
 * Returns lightweight data for the dashboard table.
 */
export async function listArticles({ page = 1, limit = 50 } = {}) {
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                author: true,
                isFeatured: true,
                isPublished: true,
                publishedAt: true,
                readTime: true,
                coverImageUrl: true,
                views: true,
                createdAt: true,
                updatedAt: true,
                category: { select: { id: true, name: true, color: true } },
            },
            orderBy: { updatedAt: "desc" },
        }),
        prisma.article.count(),
    ]);
    return { articles, total, page, limit };
}

/**
 * Get a single article by ID (full content — for the editor).
 */
export async function getArticleById(id) {
    return prisma.article.findUnique({
        where: { id: parseInt(id, 10) },
        include: { category: true },
    });
}

/**
 * Create a new article (saved as a draft by default).
 */
export async function createArticle({ title, slug, excerpt, content, author, categoryId, readTime, coverImageUrl, isFeatured = false }) {
    return prisma.article.create({
        data: {
            title,
            slug,
            excerpt,
            content,            // TipTap HTML/JSON stored as string
            author,
            categoryId: parseInt(categoryId, 10),
            readTime:   readTime ? parseInt(readTime, 10) : null,
            coverImageUrl: coverImageUrl ?? null,
            isFeatured,
            isPublished: false, // all new articles start as drafts
            publishedAt: null,
        },
        include: { category: true },
    });
}

/**
 * Update an existing article (title, body, meta, etc.).
 * Does NOT flip isPublished — use togglePublish for that.
 */
export async function updateArticle(id, { title, slug, excerpt, content, author, categoryId, readTime, coverImageUrl, isFeatured }) {
    return prisma.article.update({
        where: { id: parseInt(id, 10) },
        data: {
            ...(title        !== undefined && { title }),
            ...(slug         !== undefined && { slug }),
            ...(excerpt      !== undefined && { excerpt }),
            ...(content      !== undefined && { content }),
            ...(author       !== undefined && { author }),
            ...(categoryId   !== undefined && { categoryId: parseInt(categoryId, 10) }),
            ...(readTime     !== undefined && { readTime: parseInt(readTime, 10) }),
            ...(coverImageUrl!== undefined && { coverImageUrl }),
            ...(isFeatured   !== undefined && { isFeatured }),
        },
        include: { category: true },
    });
}

/**
 * Toggle isPublished on an article.
 * Automatically sets publishedAt when publishing, clears it when unpublishing.
 */
export async function togglePublish(id) {
    const article = await prisma.article.findUniqueOrThrow({
        where: { id: parseInt(id, 10) },
        select: { isPublished: true },
    });

    const nowPublishing = !article.isPublished;

    return prisma.article.update({
        where: { id: parseInt(id, 10) },
        data: {
            isPublished: nowPublishing,
            publishedAt: nowPublishing ? new Date() : null,
        },
        include: { category: true },
    });
}

/**
 * Hard-delete an article by ID.
 */
export async function deleteArticle(id) {
    return prisma.article.delete({
        where: { id: parseInt(id, 10) },
    });
}

// ─── Categories ──────────────────────────────────────────

/**
 * Return all categories (for the editor's category dropdown).
 */
export async function listCategories() {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true, color: true, icon: true },
    });
}
