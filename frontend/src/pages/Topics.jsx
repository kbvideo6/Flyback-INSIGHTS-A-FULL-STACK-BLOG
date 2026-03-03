// Topics Page — Grid of all articles with category filter
import { useState } from 'react'
import { Link } from 'react-router-dom'
import articles, { categories, getArticleUrl } from '../constants/articles'

const Topics = () => {
    const [activeCategory, setActiveCategory] = useState('All')

    const filtered =
        activeCategory === 'All'
            ? articles
            : articles.filter((a) => a.category === activeCategory)

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
            {/* ── Page Header ── */}
            <div className="mb-12">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Topics
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Explore our collection of deep dives, analyses, and emerging trends across the electronics landscape.
                </p>
            </div>

            {/* ── Category Filter Pills ── */}
            <div className="flex flex-wrap gap-3 mb-10">
                {['All', ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                            ${activeCategory === cat
                                ? 'bg-primary text-white shadow-lg shadow-blue-600/20'
                                : 'bg-glass-surface text-gray-300 border border-glass-border hover:bg-glass-surface-hover hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Article Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((article) => (
                    <Link
                        key={article.id}
                        to={getArticleUrl(article)}
                        className="glass-panel p-5 group cursor-pointer hover:border-primary/30 transition-all duration-500 block"
                    >
                        {/* Image placeholder */}
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-800">
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-110 transition-transform duration-700" />
                        </div>

                        {/* Category badge */}
                        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/20 rounded-full">
                            {article.category}
                        </span>

                        {/* Title */}
                        <h3 className="font-display text-xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm line-clamp-2">
                            {article.description}
                        </p>
                    </Link>
                ))}
            </div>

            {/* ── Empty state ── */}
            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No articles found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default Topics
