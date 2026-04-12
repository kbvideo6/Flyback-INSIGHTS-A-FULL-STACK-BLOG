// TableOfContents — Auto-generated sticky sidebar TOC from article body headings
// Only renders if 2+ headings are found. Mobile: collapsible; Desktop: sticky sidebar

import { useState, useEffect, useCallback } from 'react'

/**
 * Extracts headings from parsed JSON content blocks
 * @param {Array} blocks — ArticleBody content blocks
 * @returns {{ id: string, text: string, level: number }[]}
 */
const extractHeadings = (blocks) => {
    if (!Array.isArray(blocks)) return []
    return blocks
        .filter(b => b.type === 'heading' || b.type === 'subheading')
        .map((b, i) => ({
            id: `toc-${i}-${(b.content ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`,
            text: b.content ?? '',
            level: b.type === 'heading' ? 2 : 3,
        }))
}

/**
 * Extracts headings from HTML string (Tiptap output)
 * @param {string} html
 * @returns {{ id: string, text: string, level: number }[]}
 */
const extractHeadingsFromHTML = (html) => {
    if (!html || typeof html !== 'string') return []
    const matches = []
    const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi
    let m
    let i = 0
    while ((m = regex.exec(html)) !== null) {
        const text = m[2].replace(/<[^>]+>/g, '').trim()
        if (text) {
            matches.push({
                id: `toc-${i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`,
                text,
                level: parseInt(m[1], 10),
            })
            i++
        }
    }
    return matches
}

const TableOfContents = ({ content }) => {
    const [activeId, setActiveId] = useState(null)
    const [collapsed, setCollapsed] = useState(true) // mobile starts collapsed

    // Parse headings from content
    let headings = []
    if (Array.isArray(content)) {
        headings = extractHeadings(content)
    } else if (typeof content === 'string') {
        try {
            const parsed = JSON.parse(content)
            if (Array.isArray(parsed)) headings = extractHeadings(parsed)
        } catch {
            headings = extractHeadingsFromHTML(content)
        }
    }

    // Inject IDs into the rendered DOM headings (best-effort matching)
    useEffect(() => {
        if (!headings.length) return
        const allHeadings = document.querySelectorAll('h2, h3')
        let tocIdx = 0
        allHeadings.forEach((el) => {
            const text = el.textContent?.trim()
            if (tocIdx < headings.length && text === headings[tocIdx].text) {
                el.id = headings[tocIdx].id
                tocIdx++
            }
        })
    }, [headings])

    // Intersection observer for active heading tracking
    useEffect(() => {
        if (!headings.length) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
        )

        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [headings])

    const scrollTo = useCallback((id) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setCollapsed(true) // close on mobile after click
        }
    }, [])

    if (headings.length < 2) return null

    return (
        <>
            {/* ── Desktop: sticky sidebar ── */}
            <nav
                className="hidden xl:block fixed right-8 top-32 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto z-[80]"
                aria-label="Table of contents"
                style={{ scrollbarWidth: 'none' }}
            >
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
                    On this page
                </p>
                <ul className="space-y-1 border-l border-white/10">
                    {headings.map(({ id, text, level }) => (
                        <li key={id}>
                            <button
                                onClick={() => scrollTo(id)}
                                className={`block text-left w-full text-xs leading-relaxed transition-all duration-200 border-l-2 -ml-[2px] ${
                                    level === 3 ? 'pl-5' : 'pl-3'
                                } ${
                                    activeId === id
                                        ? 'text-primary border-primary font-medium'
                                        : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
                                }`}
                                style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}
                            >
                                {text}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ── Mobile: collapsible ── */}
            <div className="xl:hidden mb-8">
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="flex items-center justify-between w-full glass-panel px-4 py-3 text-sm"
                >
                    <span className="font-display font-semibold text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
                        </svg>
                        Table of Contents
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {!collapsed && (
                    <ul className="mt-2 glass-panel px-4 py-3 space-y-2 border-l-2 border-primary/30 ml-2">
                        {headings.map(({ id, text, level }) => (
                            <li key={id}>
                                <button
                                    onClick={() => scrollTo(id)}
                                    className={`text-left text-xs text-gray-400 hover:text-white transition-colors ${
                                        level === 3 ? 'pl-3' : ''
                                    } ${activeId === id ? 'text-primary font-medium' : ''}`}
                                >
                                    {text}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default TableOfContents
