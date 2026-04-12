/**
 * generate-ai-feed.js — Generates ai.json and feed.xml from Supabase articles
 *
 * Run: node scripts/generate-ai-feed.js
 *
 * Creates:
 *   public/ai.json  — structured JSON of latest 100 articles for AI agents
 *   public/feed.xml — RSS 2.0 feed for readers and AI crawlers
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = 'https://flybackelectronics.com'
const SITE_NAME = 'Flyback Electronics'
const SITE_DESC = 'In-depth electronics insights, deep dives, analysis and emerging trends in semiconductors, AI, and robotics.'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
)

function escapeXml(str) {
    if (!str) return ''
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

async function main() {
    console.log('🤖 Fetching articles for AI feeds…')

    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, author, read_time, published_at, categories(name, slug)')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error('❌ Supabase error:', error.message)
        process.exit(1)
    }

    console.log(`✅ Found ${articles.length} articles`)

    // ── ai.json ──────────────────────────────────────────────────────────
    const aiJson = {
        _meta: {
            name: SITE_NAME,
            description: SITE_DESC,
            url: SITE_URL,
            feed_url: `${SITE_URL}/ai.json`,
            rss_url: `${SITE_URL}/feed.xml`,
            generated_at: new Date().toISOString(),
            total_articles: articles.length,
            contact: 'hello@flybackelectronics.com',
        },
        articles: articles.map((a) => ({
            title: a.title,
            url: `${SITE_URL}/article/${a.slug}`,
            slug: a.slug,
            excerpt: a.excerpt ?? '',
            author: a.author ?? 'Flyback Electronics',
            category: a.categories?.name ?? 'General',
            published_at: a.published_at,
            read_time_minutes: a.read_time,
        })),
    }

    const aiJsonPath = resolve(__dirname, '..', 'public', 'ai.json')
    writeFileSync(aiJsonPath, JSON.stringify(aiJson, null, 2), 'utf-8')
    console.log(`📄 Wrote ai.json (${articles.length} articles) → ${aiJsonPath}`)

    // ── feed.xml (RSS 2.0) ───────────────────────────────────────────────
    const rssItems = articles.map((a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/article/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}</guid>
      <description>${escapeXml(a.excerpt ?? '')}</description>
      <author>${escapeXml(a.author ?? 'editorial@flybackelectronics.com')}</author>
      <category>${escapeXml(a.categories?.name ?? 'General')}</category>
      <pubDate>${new Date(a.published_at ?? Date.now()).toUTCString()}</pubDate>
    </item>`)

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/favicon.webp</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
${rssItems.join('\n')}
  </channel>
</rss>`

    const rssPath = resolve(__dirname, '..', 'public', 'feed.xml')
    writeFileSync(rssPath, rssXml, 'utf-8')
    console.log(`📄 Wrote feed.xml (${articles.length} items) → ${rssPath}`)
}

main().catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
})
