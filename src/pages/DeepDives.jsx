// Deep Dives Page — Featured hero articles + all Deep Dive category articles
import { Link } from 'react-router-dom'
import useArticles from '../hooks/useArticles'
import { getArticleUrl } from '../constants/articles'
import useSEO from '../hooks/useSEO'

const DeepDives = () => {
    useSEO({ 
        title: 'Semiconductor Tutorials & Technical Deep Dives', 
        description: 'Intensive hardware engineering explorations: From RISC-V architecture and GaN power systems to advanced PCB thermal management and embedded firmware design.' 
    })
    const { articles, isLoading } = useArticles()

    const heroArticles = articles.filter((a) => a.is_featured)
    const deepDiveArticles = articles.filter((a) => a.categories?.name?.toLowerCase().includes('deep dive') && !a.is_featured)

    if (!isLoading && heroArticles.length === 0 && deepDiveArticles.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-24 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                    <svg className="w-10 h-10 text-blue-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No deep dives available</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    We're currently diving deep into new technologies. Check back soon for intensive technical explorations.
                </p>
                <Link to="/" className="text-primary hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                    ← Back to Atlas
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
            {/* ── Page Header ── */}
            <div className="mb-12">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Deep Dives
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
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
                                {article.cover_image_url ? (
                                    <img
                                        src={article.cover_image_url}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-slate-900 to-gray-950">
                                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.3),_transparent_60%)]" />
                                    </div>
                                )}

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
                                    {article.cover_image_url ? (
                                        <img
                                            src={article.cover_image_url}
                                            alt={article.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-110 transition-transform duration-700" />
                                    )}
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
