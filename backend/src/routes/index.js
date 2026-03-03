// ─── Route Aggregator ───────────────────────────────────
// Mounts all sub-routers under a common version prefix.

import { Router } from "express";
import graphRoutes from "./graphRoutes.js";
import newsletterRoutes from "./newsletterRoutes.js";

const router = Router();

router.use("/graph", graphRoutes);
router.use("/newsletter", newsletterRoutes);

export default router;
