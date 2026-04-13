// ArticlePage — Dynamic article reading page
// Features: SEO (og, twitter, canonical, JSON-LD), TOC, Highlight-to-Share, Breadcrumbs, DOMPurify

import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import useArticle from '../hooks/useArticle'
import useArticles from '../hooks/useArticles'
import { getArticleUrl } from '../constants/articles'
import ArticleBody from '../components/layout/ArticleBody'
import useSEO from '../hooks/useSEO'
import TableOfContents from '../components/ui/TableOfContents'
import HighlightShare from '../components/ui/HighlightShare'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const BASE_URL = 'https://flybackelectronics.com'

const ArticlePage = () => {
    const { slug } = useParams()
    const { article, isLoading } = useArticle(slug)
    const { articles } = useArticles()
    const articleBodyRef = useRef(null)

    // ── Per-article SEO ──
    useSEO({
        title: article?.title,
        description: article?.excerpt,
        image: article?.cover_image_url,
        canonical: article ? `${BASE_URL}/article/${article.slug}` : undefined,
        type: 'article',
    })

    // ── Article JSON-LD structured data ──
    useEffect(() => {
        if (!article) return

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt ?? '',
            image: article.cover_image_url ? [article.cover_image_url] : [],
            datePublished: article.published_at ?? article.created_at,
            dateModified: article.updated_at ?? article.published_at ?? article.created_at,
            wordCount: typeof article.content === 'string' ? article.content.replace(/<[^>]+>/g, '').split(/\s+/).length : undefined,
            author: [{
                '@type': 'Person',
                name: article.author ?? 'Flyback Electronics',
            }],
            publisher: {
                '@type': 'Organization',
                name: 'Flyback Electronics',
                logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.webp` },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${BASE_URL}/article/${article.slug}`,
            },
        }

        let el = document.getElementById('article-jsonld')
        if (!el) {
            el = document.createElement('script')
            el.id = 'article-jsonld'
            el.type = 'application/ld+json'
            document.head.appendChild(el)
        }
        el.textContent = JSON.stringify(schema)

        return () => {
            const existing = document.getElementById('article-jsonld')
            if (existing) existing.remove()
        }
    }, [article])

    // ── Loading state ──
    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Loading article…</p>
            </div>
        )
    }

    // ── Not found state ──
    if (!article) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="font-display text-4xl font-bold text-white mb-4">Article Not Found</h1>
                <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
                <Link to="/" className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all inline-flex items-center gap-2">
                    ← Back to Home
                </Link>
            </div>
        )
    }

    // Build breadcrumb items
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        ...(article.categories?.name
            ? [{ label: article.categories.name, href: '/topics' }]
            : []),
        { label: article.title },
    ]

    const relatedArticles = articles
        .filter((a) => a.categories?.name === article.categories?.name && a.id !== article.id)
        .slice(0, 4)

    return (
        <article className="w-full max-w-3xl mx-auto px-4 lg:px-8 py-12" itemScope itemType="https://schema.org/Article">
            {/* ── Breadcrumbs ── */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* ── Back link ── */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Atlas
            </Link>

            {/* ── Hero image ── */}
            <div className="relative overflow-hidden rounded-2xl mb-8 aspect-[21/9] bg-gray-800">
                {article.cover_image_url ? (
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        itemProp="image"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 via-slate-900 to-gray-950">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.3),_transparent_60%)]" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>

            {/* ── Category badge ── */}
            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                {article.categories?.name}
            </span>

            {/* ── Title ── */}
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white leading-tight mb-6" itemProp="headline">
                {article.title}
            </h1>

            {/* ── Meta info ── */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-10 pb-8 border-b border-glass-border">
                {article.author && (
                    <span className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {article.author.charAt(0)}
                        </span>
                        <span itemProp="name">{article.author}</span>
                    </span>
                )}
                {article.published_at && (
                    <time dateTime={article.published_at} itemProp="datePublished">
                        {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                )}
                {article.read_time && (
                    <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.read_time} min read
                    </span>
                )}
            </div>

            {/* ── Table of Contents ── */}
            <TableOfContents content={article.content ?? article.body ?? null} />

            {/* ── Article Body (with highlight-to-share) ── */}
            <div ref={articleBodyRef} itemProp="articleBody">
                <ArticleBody
                    content={article.content ?? article.body ?? null}
                    imageUrl={article.image_url ?? null}
                />
            </div>

            {/* ── Highlight-to-share popup ── */}
            <HighlightShare containerRef={articleBodyRef} />

            {/* ── Share bar ── */}
            <div className="mt-12 pt-8 border-t border-glass-border">
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Share</span>
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${BASE_URL}/article/${article.slug}`)}&via=flybackelec`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 transition-all duration-200"
                        aria-label="Share on X"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/article/${article.slug}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 transition-all duration-200"
                        aria-label="Share on LinkedIn"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764S5.534 3.204 6.5 3.204s1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" /></svg>
                    </a>
                    <a
                        href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${article.excerpt}\n\nRead more: ${BASE_URL}/article/${article.slug}`)}`}
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200"
                        aria-label="Share via email"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                </div>
            </div>

            {/* ── Related articles ── */}
            {relatedArticles.length > 0 && (
                <section className="pt-2 pb-4">
                    <h3 className="font-display text-xl font-bold text-white mb-6">Continue Exploring</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedArticles.slice(0, 2).map((related) => (
                            <Link
                                key={related.id}
                                to={getArticleUrl(related)}
                                className="glass-panel p-4 group hover:border-primary/30 transition-all duration-300"
                            >
                                <span className="text-[10px] font-bold tracking-[0.15em] text-blue-300 uppercase">
                                    {related.categories?.name}
                                </span>
                                <h4 className="font-display text-lg font-bold text-white mt-1 group-hover:text-primary transition-colors leading-tight">
                                    {related.title}
                                </h4>
                                {related.excerpt && (
                                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{related.excerpt}</p>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* ── More from this category — internal linking for SEO ── */}
                    {relatedArticles.length > 2 && (
                        <div className="mt-6">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">More in {article.categories?.name}</h4>
                            <ul className="space-y-2">
                                {relatedArticles.slice(2, 4).map((r) => (
                                    <li key={r.id}>
                                        <Link to={getArticleUrl(r)} className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                                            <svg className="w-3 h-3 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            {r.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}
            {/* ── Footer / Authority Section ── */}
            <div className="mt-16 pt-12 border-t border-white/10">
                <div className="glass-panel p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl shrink-0">
                        FE
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-display font-bold text-white mb-2">About the Author</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            <strong>Flyback Engineer</strong> is an Electronic and Embedded System Design Engineer with 50+ successful PCB designs shipped globally. Specializing in high-speed digital layout, firmware development, and MERN stack IoT integration.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <a 
                                href="https://www.fiverr.com/s/your-profile-link" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs bg-primary hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Hire for Design
                            </a>
                            <Link to="/about" className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg border border-white/10 transition-colors">
                                View Credentials
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ArticlePage
