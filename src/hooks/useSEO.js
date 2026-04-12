// useSEO — manages per-page <meta> tags for og:, twitter:, and canonical
// Updates the real DOM head tags so crawlers see them.
//
// Usage:
//   useSEO({ title, description, image, canonical, type, noindex })

import { useEffect } from 'react'

const SITE_NAME = 'Flyback Electronics'
const DEFAULT_IMAGE = 'https://flybackelectronics.com/favicon.webp'
const BASE_URL = 'https://flybackelectronics.com'

const setMeta = (name, content, attr = 'name') => {
    if (!content) return
    let el = document.querySelector(`meta[${attr}="${name}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}

const setLink = (rel, href) => {
    if (!href) return
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
    }
    el.setAttribute('href', href)
}

/**
 * @param {object} opts
 * @param {string}  [opts.title]       Page title (without site name suffix)
 * @param {string}  [opts.description] Meta description
 * @param {string}  [opts.image]       Absolute URL to OG image
 * @param {string}  [opts.canonical]   Canonical URL (absolute)
 * @param {'website'|'article'} [opts.type]
 * @param {boolean} [opts.noindex]     If true, sets noindex
 */
const useSEO = ({ title, description, image, canonical, type = 'website', noindex = false } = {}) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
        const canonicalUrl = canonical ?? `${BASE_URL}${window.location.pathname}`
        const ogImage = image ?? DEFAULT_IMAGE

        // ── Document title ──
        document.title = fullTitle

        // ── Open Graph ──
        setMeta('og:title', fullTitle, 'property')
        setMeta('og:description', description, 'property')
        setMeta('og:image', ogImage, 'property')
        setMeta('og:type', type, 'property')
        setMeta('og:url', canonicalUrl, 'property')
        setMeta('og:site_name', SITE_NAME, 'property')

        // ── Twitter Card ──
        setMeta('twitter:card', 'summary_large_image')
        setMeta('twitter:title', fullTitle)
        setMeta('twitter:description', description)
        setMeta('twitter:image', ogImage)
        setMeta('twitter:site', '@flybackelec')

        // ── Standard meta ──
        if (description) setMeta('description', description)
        if (noindex) setMeta('robots', 'noindex,nofollow')
        else setMeta('robots', 'index,follow')

        // ── Canonical ──
        setLink('canonical', canonicalUrl)

        return () => {
            // Reset to base state on unmount
            document.title = SITE_NAME
            setMeta('robots', 'index,follow')
        }
    }, [title, description, image, canonical, type, noindex])
}

export default useSEO
