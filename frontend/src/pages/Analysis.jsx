// Analysis Page — Data-driven reports, market forecasts, and industry analysis
import { Link } from 'react-router-dom'
import articles, { getArticleUrl } from '../constants/articles'

const Analysis = () => {
    const analysisArticles = articles.filter((a) => a.category === 'Analysis')

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
            {/* ── Page Header ── */}
            <div className="mb-12">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
                    Analysis
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Data-driven reports, market forecasts, and strategic insights on the global electronics industry.
                </p>
            </div>

            {/* ── Featured Analysis Card (first article) ── */}
            {analysisArticles.length > 0 && (
                <div className="mb-12">
                    <Link to={getArticleUrl(analysisArticles[0])} className="group cursor-pointer relative block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-primary/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
                        <div className="relative glass-panel overflow-hidden p-8 lg:p-10 flex flex-col lg:flex-row gap-8 items-center transition-transform duration-500 group-hover:scale-[1.005]">
                            {/* Mini chart visualization */}
                            <div className="w-full lg:w-1/3 aspect-[4/3] relative rounded-xl bg-gray-900/50 border border-gray-700/30 p-6 flex-shrink-0">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Signal Analysis</span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>
                                <h4 className="font-display font-bold text-white text-lg mb-4">{analysisArticles[0].title.split(':')[0]}</h4>
                                <div className="relative h-20 w-full border-l border-b border-gray-700/50">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                        <path d="M0,45 Q20,40 40,30 T100,5 L100,50 L0,50 Z" fill="rgba(59,130,246,0.1)" />
                                        <path d="M0,45 Q20,40 40,30 T100,5" fill="none" stroke="#3B82F6" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                                    <span>2024</span>
                                    <span>2028</span>
                                </div>
                            </div>

                            {/* Text content */}
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-green-300 uppercase bg-green-900/30 border border-green-500/20 rounded-full">
                                    FEATURED ANALYSIS
                                </span>
                                <h2 className="font-display font-bold text-2xl lg:text-3xl text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                                    {analysisArticles[0].title}
                                </h2>
                                <p className="text-gray-400 text-base mb-6">
                                    {analysisArticles[0].description}
                                </p>
                                <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
                                    View Report
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* ── Analysis Articles Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisArticles.slice(1).map((article) => (
                    <Link
                        key={article.id}
                        to={getArticleUrl(article)}
                        className="glass-panel p-5 group cursor-pointer hover:border-primary/30 transition-all duration-500 block"
                    >
                        {/* Chart placeholder */}
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-900/50 border border-gray-700/20 p-4 flex flex-col justify-end">
                            <div className="absolute top-3 right-3">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                            </div>
                            <svg className="w-full h-12 overflow-visible opacity-60" preserveAspectRatio="none" viewBox="0 0 100 30">
                                <path d="M0,25 Q15,20 30,22 T60,10 T100,5" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
                            </svg>
                        </div>

                        {/* Badge */}
                        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-[0.15em] text-green-300 uppercase bg-green-900/30 border border-green-500/20 rounded-full">
                            Analysis
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
        </div>
    )
}

export default Analysis
