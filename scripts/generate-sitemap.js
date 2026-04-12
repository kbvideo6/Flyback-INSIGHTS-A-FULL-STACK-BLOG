/**
 * generate-sitemap.js — Generates sitemap.xml from Supabase articles
 *
 * Run: node scripts/generate-sitemap.js
 *
 * Pulls all published articles from Supabase and generates a complete
 * sitemap.xml with all static pages + dynamic article URLs.
 * Output: public/sitemap.xml
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://flybackelectronics.com'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
)

// Static pages
const STATIC_PAGES = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/topics', changefreq: 'daily', priority: '0.9' },
    { loc: '/deep-dives', changefreq: 'weekly', priority: '0.9' },
    { loc: '/analysis', changefreq: 'weekly', priority: '0.9' },
    { loc: '/archive', changefreq: 'daily', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/careers', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.4' },
]

async function main() {
    console.log('📍 Fetching articles from Supabase…')

    const { data: articles, error } = await supabase
        .from('articles')
        .select('slug, published_at, updated_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    if (error) {
        console.error('❌ Supabase error:', error.message)
        process.exit(1)
    }

    console.log(`✅ Found ${articles.length} published articles`)

    const articleEntries = articles.map((a) => ({
        loc: `/article/${a.slug}`,
        lastmod: (a.updated_at ?? a.published_at ?? new Date().toISOString()).split('T')[0],
        changefreq: 'weekly',
        priority: '0.8',
    }))

    const allEntries = [...STATIC_PAGES, ...articleEntries]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
    .map(
        (e) => `  <url>
    <loc>${SITE_URL}${e.loc}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`

    const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml')
    writeFileSync(outPath, xml, 'utf-8')
    console.log(`📄 Wrote ${allEntries.length} URLs to ${outPath}`)
}

main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
})
