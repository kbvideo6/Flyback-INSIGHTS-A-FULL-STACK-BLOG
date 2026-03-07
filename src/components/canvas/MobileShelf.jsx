// MobileShelf — Full mobile home experience:
//   TOP:    Horizontal swipeable bookshelf (hero + featured carousel)
//   BOTTOM: Infinite-scroll social-feed grid (loads 8 articles at a time)

import { useRef, useState, useEffect, useCallback, memo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useArticlesFeed from '../../hooks/useArticlesFeed'

/* ══════════════════════════════════════════════════════════════
   SECTION LABEL
══════════════════════════════════════════════════════════════ */
const SectionLabel = ({ children, accent = '#3B82F6', right }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '0.55rem',
        padding: '0 1.25rem', marginBottom: '1rem',
    }}>
        <div style={{
            width: '3px', height: '18px', borderRadius: '4px',
            background: `linear-gradient(180deg, ${accent}, ${accent}88)`,
            flexShrink: 0,
        }} />
        <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 800,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(156, 163, 175, 0.9)',
        }}>
            {children}
        </span>
        {right && (
            <span style={{
                marginLeft: 'auto', color: 'rgba(107, 114, 128, 0.8)',
                fontSize: '0.65rem', fontWeight: 500,
                fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums',
            }}>
                {right}
            </span>
        )}
    </div>
)

/* ══════════════════════════════════════════════════════════════
   CATEGORY CHIP
══════════════════════════════════════════════════════════════ */
const CATEGORY_COLORS = {
    'deep dive': 'rgba(59,130,246,0.82)',
    'analysis': 'rgba(16,185,129,0.82)',
    'news': 'rgba(245,158,11,0.82)',
    'tutorial': 'rgba(139,92,246,0.82)',
    'opinion': 'rgba(239,68,68,0.82)',
}
const categoryColor = (name = '') =>
    CATEGORY_COLORS[name.toLowerCase()] ?? 'rgba(59,130,246,0.82)'

const Chip = ({ label, color = 'rgba(59,130,246,0.85)', small = false }) => (
    <span style={{
        background: color,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        color: '#fff',
        fontSize: small ? '0.52rem' : '0.57rem',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: small ? '0.18rem 0.5rem' : '0.22rem 0.65rem',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.18)',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1,
        display: 'inline-block',
    }}>
        {label}
    </span>
)

/* ══════════════════════════════════════════════════════════════
   SHELF CARD  (carousel item)
══════════════════════════════════════════════════════════════ */
const ShelfCard = memo(({ node, isActive, onTap }) => {
    const isHero = node.type === 'hero'
    const img = node.coverImageUrl

    return (
        <div onClick={onTap} style={{
            flexShrink: 0,
            width: isHero ? '78vw' : '62vw',
            maxWidth: isHero ? '320px' : '260px',
            cursor: 'pointer',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
            transform: isActive ? 'scale(1.05)' : 'scale(0.91)',
            opacity: isActive ? 1 : 0.52,
            position: 'relative',
        }}>
            {isActive && (
                <div style={{
                    position: 'absolute', inset: '-4px', borderRadius: '1.6rem',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.3))',
                    filter: 'blur(12px)', zIndex: 0, pointerEvents: 'none',
                }} />
            )}

            <article style={{
                position: 'relative', zIndex: 1,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isActive ? 'rgba(99,149,255,0.45)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '1.35rem', overflow: 'hidden',
                height: isHero ? '58vw' : '46vw',
                maxHeight: isHero ? '245px' : '195px',
                boxShadow: isActive
                    ? '0 24px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,149,255,0.25)'
                    : '0 6px 20px rgba(0,0,0,0.35)',
                transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
            }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {img ? (
                        <img src={img} alt={node.title} loading="lazy" style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            transform: isActive ? 'scale(1.07)' : 'scale(1)',
                        }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1e293b,#0f172a)' }} />
                    )}

                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(4,6,16,0.97) 0%, rgba(4,6,16,0.4) 50%, rgba(4,6,16,0.1) 100%)',
                    }} />

                    <div style={{
                        position: 'absolute', top: '0.7rem', left: '0.7rem',
                        display: 'flex', gap: '0.35rem',
                    }}>
                        {isHero && <Chip label="Latest" color="rgba(59,130,246,0.9)" />}
                        {node.category && <Chip label={node.category} color="rgba(139,92,246,0.8)" />}
                    </div>

                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.8rem 0.95rem' }}>
                        <h3 style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: isHero ? '0.97rem' : '0.84rem',
                            fontWeight: 700, color: '#f9fafb', lineHeight: 1.35, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                        }}>{node.title}</h3>
                        {node.readTime && (
                            <span style={{
                                fontSize: '0.6rem', color: 'rgba(209,213,219,0.55)',
                                fontFamily: 'Inter, sans-serif', marginTop: '0.3rem',
                                display: 'block', fontWeight: 500,
                            }}>
                                {node.readTime} min read
                            </span>
                        )}
                    </div>
                </div>
            </article>

            <div style={{
                marginTop: '2px', height: '6px', borderRadius: '0 0 8px 8px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                transform: isActive ? 'scaleX(0.95)' : 'scaleX(0.88)',
                transition: 'transform 0.4s ease',
            }} />
        </div>
    )
})

/* ══════════════════════════════════════════════════════════════
   GRID CARD  (feed item) — memoized so only re-renders on prop change
══════════════════════════════════════════════════════════════ */
const GridCard = memo(({ article, tall }) => {
    const catName = article.categories?.name ?? ''
    const imgSrc = article.cover_image_url ?? article.image_url

    return (
        <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <article
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '1.1rem', overflow: 'hidden',
                    height: tall ? '230px' : '170px',
                    position: 'relative',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    // Use will-change only on transition properties to hint the GPU
                    willChange: 'transform',
                    transition: 'transform 0.2s ease',
                }}
                onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
                onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        background: `linear-gradient(135deg,
                            hsl(${(article.id ?? 0) * 47 % 360},35%,14%),
                            hsl(${(article.id ?? 0) * 47 % 360 + 50},25%,9%))`,
                    }} />
                )}

                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(4,6,16,0.98) 0%, rgba(4,6,16,0.3) 55%, transparent 100%)',
                }} />

                {catName && (
                    <div style={{ position: 'absolute', top: '0.55rem', left: '0.55rem' }}>
                        <Chip label={catName} color={categoryColor(catName)} small />
                    </div>
                )}

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: tall ? '0.75rem 0.85rem' : '0.6rem 0.75rem' }}>
                    <h3 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: tall ? '0.85rem' : '0.77rem',
                        fontWeight: 700, color: '#f9fafb', lineHeight: 1.35, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: tall ? 3 : 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    }}>{article.title}</h3>
                    {article.read_time && (
                        <span style={{
                            fontSize: '0.6rem', color: 'rgba(209,213,219,0.45)',
                            marginTop: '0.3rem', display: 'block',
                            fontFamily: 'Inter, sans-serif', fontWeight: 500,
                        }}>
                            {article.read_time} min read
                        </span>
                    )}
                </div>
            </article>
        </Link>
    )
})

/* ══════════════════════════════════════════════════════════════
   FEED SENTINEL — triggers loadMore when scrolled into view
══════════════════════════════════════════════════════════════ */
const FeedSentinel = ({ onVisible, isLoading, hasMore }) => {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) onVisible() },
            { rootMargin: '200px' }   // start loading 200px before the sentinel is visible
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [onVisible])

    return (
        <div ref={ref} style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
            {isLoading && (
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: 'rgba(99,149,255,0.7)',
                            animation: `msPulse 1.1s ease-in-out ${i * 0.18}s infinite`,
                        }} />
                    ))}
                    <style>{`
                        @keyframes msPulse {
                            0%,80%,100% { transform: scale(0.7); opacity: 0.4; }
                            40%         { transform: scale(1);   opacity: 1;   }
                        }
                    `}</style>
                </div>
            )}
            {!isLoading && !hasMore && (
                <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.6rem',
                    color: 'rgba(107,114,128,0.5)', letterSpacing: '0.08em',
                }}>
                    — You're all caught up —
                </span>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════
   MAIN MOBILE SHELF
══════════════════════════════════════════════════════════════ */
const MobileShelf = ({ nodes }) => {
    const navigate = useNavigate()
    const trackRef = useRef(null)
    const [activeIdx, setActiveIdx] = useState(0)

    const articleNodes = nodes.filter(n => n.type === 'hero' || n.type === 'standard')
    const carouselSlugs = articleNodes.map(n => n.slug).filter(Boolean)

    // Feed: paginated, excludes carousel slugs
    const { articles: feedArticles, isLoading, hasMore, loadMore } = useArticlesFeed(carouselSlugs, 8)

    const updateActive = useCallback(() => {
        const el = trackRef.current; if (!el) return
        const center = el.scrollLeft + el.clientWidth / 2
        let closest = 0, minDist = Infinity
        Array.from(el.children).forEach((child, i) => {
            const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center)
            if (dist < minDist) { minDist = dist; closest = i }
        })
        setActiveIdx(closest)
    }, [])

    useEffect(() => {
        const el = trackRef.current; if (!el) return
        el.addEventListener('scroll', updateActive, { passive: true })
        return () => el.removeEventListener('scroll', updateActive)
    }, [updateActive])

    const scrollToCard = (idx) => {
        const el = trackRef.current; if (!el) return
        const child = el.children[idx]; if (!child) return
        el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
        setActiveIdx(idx)
    }

    const handleCardTap = (node) => {
        if (node.slug) navigate(`/article/${node.slug}`)
    }

    if (!articleNodes.length) return null

    return (
        <div style={{ width: '100%', userSelect: 'none', paddingBottom: '2rem' }}>

            {/* ── Section label ── */}
            <SectionLabel right={`${activeIdx + 1} / ${articleNodes.length}`}>
                Article Atlas
            </SectionLabel>

            {/* ── Swipeable carousel ── */}
            <div ref={trackRef} style={{
                display: 'flex', gap: '0.85rem', overflowX: 'auto',
                paddingLeft: 'calc(50vw - min(39vw, 160px))',
                paddingRight: 'calc(50vw - min(39vw, 160px))',
                paddingTop: '10px',
                paddingBottom: '1rem',
                scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab',
            }}>
                {articleNodes.map((node, i) => (
                    <div key={i} style={{ scrollSnapAlign: 'center', flexShrink: 0, position: 'relative' }}>
                        <ShelfCard
                            node={node}
                            isActive={i === activeIdx}
                            onTap={() => i !== activeIdx ? scrollToCard(i) : handleCardTap(node)}
                        />
                    </div>
                ))}
                <style>{`div[style*="grab"]::-webkit-scrollbar{display:none}`}</style>
            </div>

            {/* ── Dot indicators ── */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                {articleNodes.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToCard(i)}
                        aria-label={`Card ${i + 1}`}
                        style={{
                            width: i === activeIdx ? '20px' : '5px',
                            height: '5px', borderRadius: '999px',
                            border: 'none', padding: 0, cursor: 'pointer',
                            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                            background: i === activeIdx
                                ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                                : 'rgba(255,255,255,0.14)',
                            boxShadow: i === activeIdx ? '0 0 8px rgba(99,102,241,0.5)' : 'none',
                        }}
                    />
                ))}
            </div>

            <p style={{
                textAlign: 'center', fontSize: '0.6rem',
                color: 'rgba(107, 114, 128, 0.7)', marginBottom: '1.25rem',
                fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em',
            }}>
                Swipe to browse · Tap to read
            </p>

            {/* ══ INFINITE FEED GRID ═══════════════════════════════════ */}
            {(feedArticles.length > 0 || isLoading) && (
                <div style={{ padding: '0 1rem' }}>
                    <SectionLabel accent="rgba(139,92,246,0.9)">
                        More Articles
                    </SectionLabel>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                        {feedArticles.map((article, i) => (
                            <GridCard
                                key={article.id}
                                article={article}
                                tall={i % 5 === 2}
                            />
                        ))}
                    </div>

                    {/* Sentinel: auto-triggers loadMore via IntersectionObserver */}
                    <FeedSentinel
                        onVisible={loadMore}
                        isLoading={isLoading}
                        hasMore={hasMore}
                    />
                </div>
            )}
        </div>
    )
}

export default MobileShelf
