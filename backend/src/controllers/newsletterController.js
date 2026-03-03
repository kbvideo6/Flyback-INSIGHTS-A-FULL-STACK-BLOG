// ─── Newsletter Controller ───────────────────────────────
// Translates HTTP requests into service calls and formats responses.

import * as newsletterService from "../services/newsletterService.js";

/**
 * POST /api/v1/newsletter/subscribe
 * Body: { "email": "test@example.com" }
 */
export async function subscribe(req, res, next) {
    try {
        const { email } = req.body;

        // Basic validation
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required.",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format.",
            });
        }

        const result = await newsletterService.addSubscriber(email);

        if (result.alreadySubscribed) {
            return res.status(200).json({
                success: true,
                message: "You are already subscribed!",
                data: { email: result.subscriber.email },
            });
        }

        const statusCode = result.reactivated ? 200 : 201;
        const message = result.reactivated
            ? "Welcome back! Your subscription has been reactivated."
            : "Successfully subscribed!";

        res.status(statusCode).json({
            success: true,
            message,
            data: { email: result.subscriber.email },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/v1/newsletter/unsubscribe
 * Body: { "email": "test@example.com" }
 */
export async function unsubscribe(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }

        await newsletterService.removeSubscriber(email);

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed.",
        });
    } catch (error) {
        // Handle case where email doesn't exist
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Email address not found.",
            });
        }
        next(error);
    }
}

/**
 * GET /api/v1/newsletter/count
 * Returns the total number of active subscribers.
 */
export async function getCount(req, res, next) {
    try {
        const count = await newsletterService.getSubscriberCount();
        res.status(200).json({ success: true, data: { count } });
    } catch (error) {
        next(error);
    }
}
