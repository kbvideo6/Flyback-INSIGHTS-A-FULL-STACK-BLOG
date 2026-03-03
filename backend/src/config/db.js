// ─── Prisma Client Singleton ─────────────────────────────
// Shared across all services to avoid multiple connections.

import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export default prisma;
