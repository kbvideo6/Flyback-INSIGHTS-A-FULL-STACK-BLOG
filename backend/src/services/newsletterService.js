// ─── Newsletter Service ─────────────────────────────────
// Data access layer for subscriber management.
// Rule: NO Express imports. This module only talks to the DB.

import prisma from "../config/db.js";

/**
 * Add a new subscriber. If the email already exists and is inactive,
 * re-activate the subscription instead of creating a duplicate.
 */
export async function addSubscriber(email) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if already exists
    const existing = await prisma.subscriber.findUnique({
        where: { email: normalizedEmail },
    });

    if (existing) {
        if (existing.isActive) {
            return { subscriber: existing, alreadySubscribed: true };
        }

        // Re-activate a previously unsubscribed email
        const reactivated = await prisma.subscriber.update({
            where: { email: normalizedEmail },
            data: { isActive: true, unsubscribedAt: null },
        });
        return { subscriber: reactivated, reactivated: true };
    }

    const subscriber = await prisma.subscriber.create({
        data: { email: normalizedEmail },
    });

    return { subscriber, created: true };
}

/**
 * Unsubscribe an email address.
 */
export async function removeSubscriber(email) {
    const normalizedEmail = email.trim().toLowerCase();

    return prisma.subscriber.update({
        where: { email: normalizedEmail },
        data: { isActive: false, unsubscribedAt: new Date() },
    });
}

/**
 * Get the total count of active subscribers.
 */
export async function getSubscriberCount() {
    return prisma.subscriber.count({
        where: { isActive: true },
    });
}
