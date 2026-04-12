// Breadcrumbs — SEO breadcrumb navigation with JSON-LD BreadcrumbList schema
// Renders visible breadcrumbs AND injects schema.org structured data into <head>

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BASE_URL = 'https://flybackelectronics.com'

// Map path segments to human-readable labels
const LABELS = {
    '': 'Home',
    topics: 'Topics',
    'deep-dives': 'Deep Dives',
    analysis: 'Analysis',
    article: 'Article',
    about: 'About',
    contact: 'Contact',
    careers: 'Careers',
    'privacy-policy': 'Privacy Policy',
    archive: 'Archive Atlas',
}

/**
 * @param {{ items?: { label: string, href?: string }[] }} props
 * Items override — if provided, uses these instead of auto-generating from URL.
 * Last item is always treated as current (no link).
 */
const Breadcrumbs = ({ items: explicitItems }) => {
    const location = useLocation()

    // Auto-generate from URL segments if no explicit items
    const items = explicitItems ??
        (() => {
            const segments = location.pathname.split('/').filter(Boolean)
            const crumbs = [{ label: 'Home', href: '/' }]
            let path = ''
            segments.forEach((seg, i) => {
                path += `/${seg}`
                crumbs.push({
                    label: LABELS[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    href: i < segments.length - 1 ? path : undefined, // last item = current page, no link
                })
            })
            return crumbs
        })()

    // Inject BreadcrumbList JSON-LD
    useEffect(() => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.label,
                item: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}${location.pathname}`,
            })),
        }

        let el = document.getElementById('breadcrumb-jsonld')
        if (!el) {
            el = document.createElement('script')
            el.id = 'breadcrumb-jsonld'
            el.type = 'application/ld+json'
            document.head.appendChild(el)
        }
        el.textContent = JSON.stringify(schema)

        return () => {
            const existing = document.getElementById('breadcrumb-jsonld')
            if (existing) existing.remove()
        }
    }, [items, location.pathname])

    // Don't render breadcrumbs on home page
    if (location.pathname === '/') return null

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1.5 text-xs text-gray-500">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                        {i > 0 && (
                            <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                        {item.href ? (
                            <Link
                                to={item.href}
                                className="hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-300 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
