// Deep Dives Page — Featured hero articles + all Deep Dive category articles
import { Link } from 'react-router-dom'
import useArticles from '../hooks/useArticles'
import { getArticleUrl } from '../constants/articles'

const DeepDives = () => {
    const { articles, isLoading } = useArticles()

    const heroArticles = articles.filter((a) => a.is_featured)
    const deepDiveArticles = articles.filter((a) => a.categories?.name === 'Deep Dive' && !a.is_featured)

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
            {/* ── Page Header ── */}
            <div className="mb-12">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Deep Dives
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    In-depth explorations of the technologies shaping the future of electronics and computing.
                </p>
            </div>

            {/* ── Hero / Featured Articles ── */}
            <div className="space-y-8 mb-16">
                {heroArticles.map((article) => (
                    <Link
                        to={getArticleUrl(article)}
                        key={article.id}
                        className="group cursor-pointer relative block"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
                        <div className="relative overflow-hidden rounded-3xl glass-panel shadow-2xl border-white/10 transition-transform duration-500 group-hover:scale-[1.005]">
                            <div className="aspect-[21/9] relative">
                                {/* Image placeholder */}
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 via-slate-900 to-gray-950">
                                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.3),_transparent_60%)]" />
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/30 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end">
                                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 backdrop-blur-md border border-blue-500/30 rounded-full w-fit">
                                        {article.tag || 'FEATURED DEEP DIVE'}
                                    </span>
                                    <h2 className="font-display font-bold text-3xl lg:text-5xl text-white leading-tight mb-4">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-300 text-base lg:text-lg mb-6 max-w-2xl line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <span className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
                                        Read Deep Dive
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── Deep Dive Articles Grid ── */}
            {deepDiveArticles.length > 0 && (
                <>
                    <h2 className="font-display text-2xl font-bold text-white mb-8">
                        More Deep Dives
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deepDiveArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={getArticleUrl(article)}
                                className="glass-panel p-5 group cursor-pointer hover:border-primary/30 transition-all duration-500 block"
                            >
                                {/* Image placeholder */}
                                <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-800">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/20 rounded-full">
                                    Deep Dive
                                </span>

                                <h3 className="font-display text-xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default DeepDives
