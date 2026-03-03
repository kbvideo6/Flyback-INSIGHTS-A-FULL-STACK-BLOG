// ─── Admin Controller ───────────────────────────────────
// Express request/response layer for the CMS admin panel.
// All routes here are protected by requireAuth middleware.

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_BASE_URL } from "../config/r2.js";
import * as adminService from "../services/adminService.js";

// ─── Articles ────────────────────────────────────────────

/**
 * GET /api/v1/admin/articles
 * List all articles (including drafts) for the dashboard table.
 */
export async function listArticles(req, res, next) {
    try {
        const page  = parseInt(req.query.page,  10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const data  = await adminService.listArticles({ page, limit });
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/v1/admin/articles/:id
 * Get a single article's full content for the editor.
 */
export async function getArticle(req, res, next) {
    try {
        const article = await adminService.getArticleById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: "Article not found." });
        res.json({ success: true, article });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/v1/admin/articles
 * Create a new article (saved as draft).
 * Body: { title, slug, excerpt, content, author, categoryId, readTime?, coverImageUrl? }
 */
export async function createArticle(req, res, next) {
    try {
        const { title, slug, excerpt, content, author, categoryId, readTime, coverImageUrl, isFeatured } = req.body;

        if (!title || !slug || !content || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Required fields: title, slug, content, categoryId.",
            });
        }

        const article = await adminService.createArticle({
            title, slug, excerpt, content, author, categoryId, readTime, coverImageUrl, isFeatured,
        });
        res.status(201).json({ success: true, article });
    } catch (err) {
        // Unique constraint on slug
        if (err.code === "P2002") {
            return res.status(409).json({ success: false, message: `Slug "${req.body.slug}" is already taken.` });
        }
        next(err);
    }
}

/**
 * PUT /api/v1/admin/articles/:id
 * Full update of an article's content and metadata.
 */
export async function updateArticle(req, res, next) {
    try {
        const article = await adminService.updateArticle(req.params.id, req.body);
        res.json({ success: true, article });
    } catch (err) {
        if (err.code === "P2025") return res.status(404).json({ success: false, message: "Article not found." });
        if (err.code === "P2002") return res.status(409).json({ success: false, message: "Slug is already taken." });
        next(err);
    }
}

/**
 * PATCH /api/v1/admin/articles/:id/publish
 * Toggle isPublished. Sets publishedAt when publishing, clears it when unpublishing.
 */
export async function togglePublish(req, res, next) {
    try {
        const article = await adminService.togglePublish(req.params.id);
        const state   = article.isPublished ? "published" : "unpublished";
        res.json({ success: true, message: `Article ${state}.`, article });
    } catch (err) {
        if (err.code === "P2025") return res.status(404).json({ success: false, message: "Article not found." });
        next(err);
    }
}

/**
 * DELETE /api/v1/admin/articles/:id
 * Permanently delete an article.
 */
export async function deleteArticle(req, res, next) {
    try {
        await adminService.deleteArticle(req.params.id);
        res.json({ success: true, message: "Article deleted." });
    } catch (err) {
        if (err.code === "P2025") return res.status(404).json({ success: false, message: "Article not found." });
        next(err);
    }
}

// ─── Categories ──────────────────────────────────────────

/**
 * GET /api/v1/admin/categories
 * List all categories for the editor's category dropdown.
 */
export async function listCategories(req, res, next) {
    try {
        const categories = await adminService.listCategories();
        res.json({ success: true, categories });
    } catch (err) {
        next(err);
    }
}

// ─── Image Upload ────────────────────────────────────────

/**
 * POST /api/v1/admin/upload
 * Upload a single image (cover photo) to Cloudflare R2.
 *
 * Request: multipart/form-data with field name "image"
 * Response: { success: true, url: "https://pub-<hash>.r2.dev/<key>" }
 *
 * Uses multer (memoryStorage) — file is in req.file.buffer.
 */
export async function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file received. Use field name \"image\"." });
        }

        const ext       = req.file.originalname.split(".").pop().toLowerCase();
        const key       = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        await r2.send(
            new PutObjectCommand({
                Bucket:      R2_BUCKET,
                Key:         key,
                Body:        req.file.buffer,
                ContentType: req.file.mimetype,
                // Public bucket — no ACL needed; public access set via R2 dashboard
            })
        );

        const url = `${R2_BASE_URL}/${key}`;
        res.status(201).json({ success: true, url });
    } catch (err) {
        next(err);
    }
}
