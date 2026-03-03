// api.js — Thin fetch wrapper over VITE_API_URL
// All requests go through here so base URL and error handling are centralised.

import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/**
 * Core request helper.
 * @param {string} path   - API path, e.g. '/api/v1/articles'
 * @param {RequestInit} options - fetch options (method, body, headers…)
 * @returns {Promise<any>} - Parsed JSON response
 */
async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    // Attach Supabase JWT for all admin routes
    if (path.includes('/admin/')) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`
        }
    }

    const res = await fetch(url, {
        ...options,
        headers,
    })

    if (!res.ok) {
        const message = await res.text().catch(() => `HTTP ${res.status}`)
        throw new Error(message || `Request failed: ${res.status}`)
    }

    // 204 No Content — return null instead of trying to parse JSON
    if (res.status === 204) return null

    return res.json()
}

// ── Convenience wrappers ──────────────────────────────────────────────────

export const api = {
    get: (path, options) => request(path, { method: 'GET', ...options }),
    post: (path, body, options) =>
        request(path, { method: 'POST', body: JSON.stringify(body), ...options }),
    put: (path, body, options) =>
        request(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
    patch: (path, body, options) =>
        request(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
    delete: (path, options) => request(path, { method: 'DELETE', ...options }),
}

export default api
