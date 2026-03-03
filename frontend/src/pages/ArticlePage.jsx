// ArticlePage — Dynamic article reading page based on :slug param
import { useParams, Link } from 'react-router-dom'
import useArticle from '../hooks/useArticle'
import articles, { getArticleUrl } from '../constants/articles'

const ArticlePage = () => {
    const { slug } = useParams()
    const { article, isLoading, error } = useArticle(slug)

    // ── Loading state ──
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Loading article…</p>
            </div>
        )
    }

    // ── Not found / error state ──
    if (!article) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="font-display text-4xl font-bold text-white mb-4">Article Not Found</h1>
                <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all inline-flex items-center gap-2"
                >
                    ← Back to Home
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4 lg:px-8 py-12">
            {/* ── Back link ── */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm mb-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Atlas
            </Link>

            {/* ── Hero image placeholder ── */}
            <div className="relative overflow-hidden rounded-2xl mb-8 aspect-[21/9] bg-gray-800">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-slate-900 to-gray-950">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.3),_transparent_60%)]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>

            {/* ── Category badge ── */}
            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                {article.category}
            </span>

            {/* ── Title ── */}
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {article.title}
            </h1>

            {/* ── Meta info ── */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-10 pb-8 border-b border-glass-border">
                {article.author && (
                    <span className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {article.author.charAt(0)}
                        </span>
                        {article.author}
                    </span>
                )}
                {article.date && <span>{article.date}</span>}
                {article.readTime && (
                    <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime}
                    </span>
                )}
            </div>

            {/* ── Article Body ── */}
            <div className="space-y-6">
                {article.body ? (
                    article.body.map((block, index) => {
                        if (block.type === 'heading') {
                            return (
                                <h2
                                    key={index}
                                    className="font-display text-2xl font-bold text-white mt-10 mb-4"
                                >
                                    {block.content}
                                </h2>
                            )
                        }
                        return (
                            <p
                                key={index}
                                className="text-gray-300 text-base lg:text-lg leading-relaxed"
                            >
                                {block.content}
                            </p>
                        )
                    })
                ) : (
                    <p className="text-gray-400 text-lg italic">Full article content coming soon.</p>
                )}
            </div>

            {/* ── Footer / Related section ── */}
            <div className="mt-16 pt-8 border-t border-glass-border">
                <h3 className="font-display text-xl font-bold text-white mb-6">Continue Exploring</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {articles
                        .filter((a) => a.category === article.category && a.id !== article.id)
                        .slice(0, 2)
                        .map((related) => (
                            <Link
                                key={related.id}
                                to={getArticleUrl(related)}
                                className="glass-panel p-4 group hover:border-primary/30 transition-all duration-300"
                            >
                                <span className="text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase">
                                    {related.category}
                                </span>
                                <h4 className="font-display text-lg font-bold text-white mt-1 group-hover:text-primary transition-colors leading-tight">
                                    {related.title}
                                </h4>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default ArticlePage
