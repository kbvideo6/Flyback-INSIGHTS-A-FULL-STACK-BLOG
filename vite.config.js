import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],

    // ── Build output ────────────────────────────────────────────────────────
    build: {
        outDir: 'dist',
        // Chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react'
                        }
                        if (id.includes('@supabase')) {
                            return 'vendor-supabase'
                        }
                        if (id.includes('@tiptap')) {
                            return 'vendor-tiptap'
                        }
                    }
                },
            },
        },
    },

    // ── Dev Server ──────────────────────────────────────────────────────────
    server: {
        port: 5173,
        proxy: {
            // Forward all /api and /health requests to the Express backend
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/health': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});