// Archive Atlas Page — Chronological archive of all published articles
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useArticles from '../hooks/useArticles'
import useSEO from '../hooks/useSEO'
import { getArticleUrl } from '../constants/articles'

const ArchiveAtlas = () => {
    useSEO({
        title: 'Chronological Technical Archive | Flyback Electronics',
        description: 'Explore our complete library of electronics intelligence. Every deep dive, hardware tutorial, and market report published at Flyback, meticulously indexed for technical research.'
    })
    const { articles, isLoading } = useArticles()
    const [search, setSearch] = useState('')

    // Group articles by year → month
    const grouped = useMemo(() => {
        const filtered = articles.filter(a =>
            !search ||
            a.title?.toLowerCase().includes(search.toLowerCase()) ||
            a.categories?.name?.toLowerCase().includes(search.toLowerCase()) ||
            a.excerpt?.toLowerCase().includes(search.toLowerCase())
        )

        // Sort newest first
        const sorted = [...filtered].sort(
            (a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)
        )

        return sorted.reduce((acc, article) => {
            const date = new Date(article.published_at || article.created_at)
            const year = date.getFullYear()
            const month = date.toLocaleString('en-GB', { month: 'long' })
            const key = `${year}__${month}`
            if (!acc[key]) acc[key] = { year, month, articles: [] }
            acc[key].articles.push(article)
            return acc
        }, {})
    }, [articles, search])

    const totalCount = articles.length
    const filteredCount = Object.values(grouped).reduce((s, g) => s + g.articles.length, 0)

    return (
        <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Header ── */}
            <div className="mb-12">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                    Complete Archive
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Archive Atlas
                </h1>
                <p className="text-gray-400 text-lg max-w-xl">
                    Every article we've ever published, sorted chronologically. Use the search to navigate the full library.
                </p>
            </div>

            {/* ── Search + count ── */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <div className="relative flex-1 w-full sm:max-w-sm">
                    <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search the archive…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-glass-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                    />
                </div>
                <p className="text-xs text-gray-500 shrink-0">
                    Showing <span className="text-gray-300 font-semibold">{filteredCount}</span> of <span className="text-gray-300 font-semibold">{totalCount}</span> articles
                </p>
            </div>

            {/* ── Loading ── */}
            {isLoading && (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-white/5 rounded w-32 mb-4" />
                            {[1, 2, 3].map(j => (
                                <div key={j} className="flex gap-4 py-3 border-b border-white/5">
                                    <div className="h-3 bg-white/5 rounded w-20 shrink-0" />
                                    <div className="h-3 bg-white/5 rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Archive groups ── */}
            {!isLoading && filteredCount === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No articles found matching "{search}"</p>
                    <button onClick={() => setSearch('')} className="mt-4 text-sm text-primary hover:text-blue-300 transition-colors">
                        Clear search
                    </button>
                </div>
            )}

            {!isLoading && (
                <div className="space-y-12">
                    {Object.values(grouped).map(({ year, month, articles: groupArticles }) => (
                        <div key={`${year}-${month}`}>

                            {/* ── Month/Year heading ── */}
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="font-display font-bold text-gray-300 text-sm tracking-widest uppercase">
                                    {month} <span className="text-primary">{year}</span>
                                </h2>
                                <div className="flex-1 h-px bg-glass-border" />
                                <span className="text-xs text-gray-600">{groupArticles.length} article{groupArticles.length !== 1 ? 's' : ''}</span>
                            </div>

                            {/* ── Article list ── */}
                            <div className="space-y-0">
                                {groupArticles.map((article, idx) => {
                                    const date = new Date(article.published_at || article.created_at)
                                    return (
                                        <Link
                                            key={article.id}
                                            to={getArticleUrl(article)}
                                            className={`
                                                flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6
                                                py-4 px-2 group transition-all duration-200 hover:bg-white/[0.03] rounded-lg
                                                ${idx < groupArticles.length - 1 ? 'border-b border-glass-border' : ''}
                                            `}
                                        >
                                            {/* Date */}
                                            <span className="text-xs text-gray-600 font-mono shrink-0 w-20 tabular-nums">
                                                {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>

                                            {/* Category pill */}
                                            <span className="shrink-0 hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold tracking-widest text-blue-300 bg-blue-900/30 border border-blue-500/15 rounded-full uppercase whitespace-nowrap">
                                                {article.categories?.name || 'Article'}
                                            </span>

                                            {/* Title */}
                                            <span className="flex-1 text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-snug">
                                                {article.title}
                                            </span>

                                            {/* Arrow */}
                                            <svg className="hidden sm:block w-3.5 h-3.5 text-gray-700 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ArchiveAtlas
