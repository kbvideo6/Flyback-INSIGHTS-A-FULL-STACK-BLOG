// ─── Admin Routes ───────────────────────────────────────
// All routes are protected by requireAuth + adminLimiter.
// Mounted at /api/v1/admin in routes/index.js

import { Router } from "express";
import multer from "multer";

import { requireAuth }  from "../middleware/auth.js";
import { adminLimiter } from "../middleware/rateLimiter.js";
import * as admin       from "../controllers/adminController.js";

const router   = Router();

// multer — in-memory storage (files go straight to R2, never hit disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter(_req, file, cb) {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
        cb(null, allowed.includes(file.mimetype));
    },
});

// ─── Apply rate-limit + auth to every admin route ────────
router.use(adminLimiter);
router.use(requireAuth);

// ─── Articles ─────────────────────────────────────────────
router.get(   "/articles",              admin.listArticles);
router.get(   "/articles/:id",          admin.getArticle);
router.post(  "/articles",              admin.createArticle);
router.put(   "/articles/:id",          admin.updateArticle);
router.patch( "/articles/:id/publish",  admin.togglePublish);
router.delete("/articles/:id",          admin.deleteArticle);

// ─── Categories ───────────────────────────────────────────
router.get("/categories", admin.listCategories);

// ─── Image Upload ─────────────────────────────────────────
router.post("/upload", upload.single("image"), admin.uploadImage);

export default router;
