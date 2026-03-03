// ─── Newsletter Routes ──────────────────────────────────
// Maps HTTP methods + URL paths → newsletter controller handlers.

import { Router } from "express";
import {
    subscribe,
    unsubscribe,
    getCount,
} from "../controllers/newsletterController.js";

const router = Router();

// Subscribe / Unsubscribe
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Stats
router.get("/count", getCount);

export default router;
