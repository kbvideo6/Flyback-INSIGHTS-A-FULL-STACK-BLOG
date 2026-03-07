// Topics Page — Two-level navigation: Main Topics → Subtopics → Articles
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useArticles from '../hooks/useArticles'
import useTopicTree from '../hooks/useTopicTree'
import { getArticleUrl } from '../constants/articles'
import usePageTitle from '../hooks/usePageTitle'

// ── Topic accent colours (fallback if DB color is absent) ──────────────
const TOPIC_COLORS = {
    electronics: { ring: 'ring-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-300', badge: 'bg-blue-900/40 border-blue-500/30 text-blue-300' },
    ai: { ring: 'ring-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-300', badge: 'bg-purple-900/40 border-purple-500/30 text-purple-300' },
    robotics: { ring: 'ring-red-500/40', bg: 'bg-red-500/10', text: 'text-red-300', badge: 'bg-red-900/40 border-red-500/30 text-red-300' },
}
const DEFAULT_COLOR = { ring: 'ring-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-300', badge: 'bg-blue-900/40 border-blue-500/30 text-blue-300' }

const getColor = (slug) => TOPIC_COLORS[slug] ?? DEFAULT_COLOR

// ── Article card ────────────────────────────────────────────────────────
const ArticleCard = ({ article }) => (
    <Link
        to={getArticleUrl(article)}
        className="glass-panel p-5 group cursor-pointer hover:border-primary/30 transition-all duration-500 block"
    >
        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-800">
            {article.cover_image_url ? (
                <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-110 transition-transform duration-700" />
            )}
        </div>
        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/20 rounded-full">
            {article.categories?.name}
        </span>
        <h3 className="font-display text-xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
            {article.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{article.excerpt}</p>
    </Link>
)

// ── Loading skeleton ────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-panel p-5 animate-pulse">
                <div className="rounded-xl mb-4 aspect-video bg-white/5" />
                <div className="h-3 bg-white/5 rounded-full w-20 mb-3" />
                <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/5 rounded w-full" />
            </div>
        ))}
    </div>
)

// ── Main Topics page ────────────────────────────────────────────────────
const Topics = () => {
    usePageTitle('Topics')
    const { topicTree, isLoading: treeLoading } = useTopicTree()
    const { articles, isLoading: articlesLoading } = useArticles()

    // activeTopic: slug of selected main topic (null = all)
    // activeSubtopic: slug of selected subtopic (null = all within topic)
    const [activeTopic, setActiveTopic] = useState(null)
    const [activeSubtopic, setActiveSubtopic] = useState(null)

    const isLoading = treeLoading || articlesLoading

    // The active main topic object
    const activeTopicObj = topicTree.find(t => t.slug === activeTopic) ?? null
    const colors = getColor(activeTopic ?? '')

    // Subtopics of currently selected main topic
    const visibleSubtopics = activeTopicObj?.subtopics ?? []

    // Filtered articles
    const filtered = useMemo(() => {
        if (!activeTopic) return articles
        const topicSubtopicSlugs = new Set(activeTopicObj?.subtopics?.map(s => s.slug) ?? [])

        // Match articles whose category.slug matches the active subtopic,
        // or (if no subtopic selected) any subtopic under the active topic
        return articles.filter(a => {
            const catSlug = a.categories?.slug
            if (activeSubtopic) return catSlug === activeSubtopic
            // No subtopic — show all under the main topic
            // Also match if the article's category IS the parent topic
            return catSlug === activeTopic || topicSubtopicSlugs.has(catSlug)
        })
    }, [articles, activeTopic, activeSubtopic, activeTopicObj])

    const handleTopicClick = (slug) => {
        if (activeTopic === slug) {
            // Clicking active topic a second time → reset to All
            setActiveTopic(null)
            setActiveSubtopic(null)
        } else {
            setActiveTopic(slug)
            setActiveSubtopic(null)
        }
    }

    const handleSubtopicClick = (slug) => {
        setActiveSubtopic(prev => prev === slug ? null : slug)
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">

            {/* ── Page Header ── */}
            <div className="mb-10">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">Topics</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Explore deep dives, analyses, and emerging trends across electronics, AI, and robotics.
                </p>
            </div>

            {/* ── Level 1: Main topic cards ── */}
            {!treeLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* "All" card */}
                    <button
                        onClick={() => { setActiveTopic(null); setActiveSubtopic(null) }}
                        className={`glass-panel p-5 text-left transition-all duration-300 ring-1
                            ${!activeTopic
                                ? 'ring-primary/60 bg-primary/10'
                                : 'ring-transparent hover:ring-white/10'
                            }`}
                    >
                        <span className="text-2xl mb-2 block">🗂️</span>
                        <h2 className="font-display font-bold text-white text-lg">All Topics</h2>
                        <p className="text-gray-500 text-xs mt-1">{articles.length} articles</p>
                    </button>

                    {topicTree.map(topic => {
                        const tc = getColor(topic.slug)
                        const isActive = activeTopic === topic.slug
                        const count = articles.filter(a => {
                            const slugs = new Set(topic.subtopics?.map(s => s.slug) ?? [])
                            return a.categories?.slug === topic.slug || slugs.has(a.categories?.slug)
                        }).length
                        return (
                            <button
                                key={topic.slug}
                                onClick={() => handleTopicClick(topic.slug)}
                                className={`glass-panel p-5 text-left transition-all duration-300 ring-1
                                    ${isActive ? `${tc.ring} ${tc.bg}` : 'ring-transparent hover:ring-white/10'}`}
                            >
                                <div className={`text-2xl mb-2`}>
                                    {topic.slug === 'electronics' ? '⚡' : topic.slug === 'ai' ? '🧠' : '🤖'}
                                </div>
                                <h2 className={`font-display font-bold text-lg ${isActive ? tc.text : 'text-white'}`}>
                                    {topic.name}
                                </h2>
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{topic.description}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-gray-600 text-xs">{count} articles</span>
                                    <span className="text-gray-600 text-xs">{topic.subtopics?.length ?? 0} subtopics</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* ── Level 2: Subtopic pills (only shown when a topic is selected) ── */}
            {activeTopic && visibleSubtopics.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`h-px flex-1 ${colors.bg} bg-opacity-30`} />
                        <span className="text-xs text-gray-500 tracking-widest uppercase font-semibold">Subtopics</span>
                        <div className={`h-px flex-1 ${colors.bg} bg-opacity-30`} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveSubtopic(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                ${!activeSubtopic
                                    ? `bg-primary text-white shadow-lg shadow-primary/20`
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            All
                        </button>
                        {visibleSubtopics.map(sub => (
                            <button
                                key={sub.slug}
                                onClick={() => handleSubtopicClick(sub.slug)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                                    ${activeSubtopic === sub.slug
                                        ? `bg-primary text-white shadow-lg shadow-primary/20`
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Breadcrumb + result count ── */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <button
                    onClick={() => { setActiveTopic(null); setActiveSubtopic(null) }}
                    className={`hover:text-white transition-colors ${!activeTopic ? 'text-white font-semibold' : ''}`}
                >
                    All
                </button>
                {activeTopic && (
                    <>
                        <span>/</span>
                        <button
                            onClick={() => { setActiveSubtopic(null) }}
                            className={`hover:text-white transition-colors ${!activeSubtopic ? 'text-white font-semibold' : ''}`}
                        >
                            {activeTopicObj?.name}
                        </button>
                    </>
                )}
                {activeSubtopic && (
                    <>
                        <span>/</span>
                        <span className="text-white font-semibold">
                            {visibleSubtopics.find(s => s.slug === activeSubtopic)?.name}
                        </span>
                    </>
                )}
                <span className="ml-2 text-gray-600">— {filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* ── Article Grid ── */}
            {isLoading && <Skeleton />}

            {!isLoading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(article => <ArticleCard key={article.id} article={article} />)}
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No articles in this subtopic yet.</p>
                    <button
                        onClick={() => { setActiveTopic(null); setActiveSubtopic(null) }}
                        className="mt-4 text-sm text-primary hover:text-blue-300 transition-colors"
                    >
                        ← Browse all topics
                    </button>
                </div>
            )}
        </div>
    )
}

export default Topics
