// ─── Server Entry Point ─────────────────────────────────
// Binds the Express app to a port and starts listening.

import app from "./app.js";
import env from "./config/env.js";

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║   Flyback Electronics API Server             ║
  ╠══════════════════════════════════════════════╣
  ║   Port:        ${String(PORT).padEnd(28)}║
  ║   Environment: ${env.NODE_ENV.padEnd(28)}║
  ║   API Base:    /api/v1                       ║
  ║   Health:      /health                       ║
  ╚══════════════════════════════════════════════╝
  `);
});
