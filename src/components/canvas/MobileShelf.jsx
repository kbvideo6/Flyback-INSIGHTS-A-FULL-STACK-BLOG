// MobileShelf — Full mobile home experience:
//   TOP:    Horizontal swipeable bookshelf (hero + featured carousel)
//   BOTTOM: Masonry-style grid of ALL remaining articles

import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useArticles from '../../hooks/useArticles'

/* ══════════════════════════════════════════════════════════════
   SHELF CARD  (carousel item)
══════════════════════════════════════════════════════════════ */
const ShelfCard = ({ node, isActive, onTap }) => {
    const isHero = node.type === 'hero'
    const img = node.coverImageUrl

    return (
        <div onClick={onTap} style={{
            flexShrink: 0,
            width: isHero ? '76vw' : '60vw',
            maxWidth: isHero ? '310px' : '250px',
            cursor: 'pointer',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
            transform: isActive ? 'scale(1.04) translateY(-6px)' : 'scale(0.93) translateY(0px)',
            opacity: isActive ? 1 : 0.6,
            borderRadius: '1.25rem',
            position: 'relative',
        }}>
            {isActive && (
                <div style={{
                    position: 'absolute', inset: '-3px', borderRadius: '1.4rem',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.4))',
                    filter: 'blur(8px)', zIndex: 0, pointerEvents: 'none',
                }} />
            )}
            <article style={{
                position: 'relative', zIndex: 1,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${isActive ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '1.25rem', overflow: 'hidden',
                height: isHero ? '56vw' : '44vw',
                maxHeight: isHero ? '235px' : '185px',
            }}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {img ? (
                        <img src={img} alt={node.title} loading="lazy" style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            transform: isActive ? 'scale(1.06)' : 'scale(1)',
                        }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1e293b,#0f172a)' }} />
                    )}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(5,7,15,0.93) 0%, rgba(5,7,15,0.25) 55%, transparent 100%)',
                    }} />
                    {isHero && (
                        <span style={{
                            position: 'absolute', top: '0.6rem', left: '0.6rem',
                            background: 'rgba(59,130,246,0.9)', backdropFilter: 'blur(8px)',
                            color: '#fff', fontSize: '0.58rem', fontWeight: 700,
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            padding: '0.2rem 0.6rem', borderRadius: '999px',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>Latest</span>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.7rem 0.85rem' }}>
                        <h3 style={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: isHero ? '0.92rem' : '0.8rem', fontWeight: 700,
                            color: '#fff', lineHeight: 1.3, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{node.title}</h3>
                    </div>
                </div>
            </article>
            <div style={{
                marginTop: '3px', height: '5px', borderRadius: '0 0 6px 6px',
                background: 'linear-gradient(to bottom,rgba(0,0,0,0.35),transparent)',
                transform: 'scaleX(0.9)',
            }} />
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════
   GRID CARD  (masonry grid item)
══════════════════════════════════════════════════════════════ */
const GridCard = ({ article, tall }) => (
    <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '1rem', overflow: 'hidden',
            height: tall ? '220px' : '165px',
            position: 'relative',
            transition: 'border-color 0.25s, transform 0.25s',
        }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            {/* Background image */}
            {article.cover_image_url || article.image_url ? (
                <img
                    src={article.cover_image_url ?? article.image_url}
                    alt={article.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg,
                        hsl(${(article.id ?? 0) * 37 % 360},40%,12%),
                        hsl(${(article.id ?? 0) * 37 % 360 + 40},30%,8%))`,
                }} />
            )}

            {/* Gradient overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(4,6,14,0.96) 0%, rgba(4,6,14,0.35) 60%, transparent 100%)',
            }} />

            {/* Category chip */}
            {article.categories?.name && (
                <span style={{
                    position: 'absolute', top: '0.5rem', left: '0.5rem',
                    background: 'rgba(59,130,246,0.75)', backdropFilter: 'blur(6px)',
                    color: '#fff', fontSize: '0.55rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '0.15rem 0.5rem', borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.15)',
                }}>
                    {article.categories.name}
                </span>
            )}

            {/* Text */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.6rem 0.75rem' }}>
                <h3 style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: tall ? '0.82rem' : '0.75rem',
                    fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: tall ? 3 : 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{article.title}</h3>
                {article.read_time && (
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', display: 'block' }}>
                        {article.read_time} min read
                    </span>
                )}
            </div>
        </article>
    </Link>
)

/* ══════════════════════════════════════════════════════════════
   MAIN MOBILE SHELF
══════════════════════════════════════════════════════════════ */
const MobileShelf = ({ nodes }) => {
    const navigate = useNavigate()
    const trackRef = useRef(null)
    const [activeIdx, setActiveIdx] = useState(0)

    // Fetch ALL articles for the grid section
    const { articles: allArticles } = useArticles()

    const drag = useRef({ active: false, startX: 0, startScroll: 0, velX: 0, lastX: 0, lastT: 0, rafId: null })

    const articleNodes = nodes.filter(n => n.type === 'hero' || n.type === 'standard')

    // Grid articles = all articles not already in the carousel (skip first 7)
    const carouselSlugs = new Set(articleNodes.map(n => n.slug).filter(Boolean))
    const gridArticles = allArticles.filter(a => !carouselSlugs.has(a.slug))

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

    const applyMomentum = useCallback(() => {
        const el = trackRef.current; if (!el) return
        const d = drag.current
        if (Math.abs(d.velX) < 0.5) { updateActive(); return }
        el.scrollLeft += d.velX; d.velX *= 0.93
        d.rafId = requestAnimationFrame(applyMomentum)
    }, [updateActive])

    const onPointerDown = useCallback((e) => {
        cancelAnimationFrame(drag.current.rafId)
        const x = e.touches ? e.touches[0].clientX : e.clientX
        drag.current = { ...drag.current, active: true, startX: x, startScroll: trackRef.current.scrollLeft, velX: 0, lastX: x, lastT: Date.now() }
        trackRef.current.style.scrollSnapType = 'none'
    }, [])

    const onPointerMove = useCallback((e) => {
        if (!drag.current.active) return
        e.preventDefault()
        const x = e.touches ? e.touches[0].clientX : e.clientX
        const now = Date.now(), dt = now - drag.current.lastT || 16
        drag.current.velX = (drag.current.lastX - x) / dt * 16
        drag.current.lastX = x; drag.current.lastT = now
        trackRef.current.scrollLeft = drag.current.startScroll + (drag.current.startX - x)
    }, [])

    const onPointerUp = useCallback(() => {
        if (!drag.current.active) return
        drag.current.active = false
        trackRef.current.style.scrollSnapType = 'x mandatory'
        drag.current.rafId = requestAnimationFrame(applyMomentum)
    }, [applyMomentum])

    useEffect(() => {
        const el = trackRef.current; if (!el) return
        el.addEventListener('touchstart', onPointerDown, { passive: true })
        el.addEventListener('touchmove', onPointerMove, { passive: false })
        el.addEventListener('touchend', onPointerUp)
        el.addEventListener('mousedown', onPointerDown)
        window.addEventListener('mousemove', onPointerMove)
        window.addEventListener('mouseup', onPointerUp)
        el.addEventListener('scroll', updateActive, { passive: true })
        return () => {
            el.removeEventListener('touchstart', onPointerDown)
            el.removeEventListener('touchmove', onPointerMove)
            el.removeEventListener('touchend', onPointerUp)
            el.removeEventListener('mousedown', onPointerDown)
            window.removeEventListener('mousemove', onPointerMove)
            window.removeEventListener('mouseup', onPointerUp)
            el.removeEventListener('scroll', updateActive)
            cancelAnimationFrame(drag.current.rafId)
        }
    }, [onPointerDown, onPointerMove, onPointerUp, updateActive])

    const scrollToCard = (idx) => {
        const el = trackRef.current; if (!el) return
        const child = el.children[idx]; if (!child) return
        el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
        setActiveIdx(idx)
    }

    const handleCardTap = (node) => {
        if (!drag.current.active && node.slug) navigate(`/article/${node.slug}`)
    }

    if (!articleNodes.length) return null

    return (
        <div style={{ width: '100%', userSelect: 'none', paddingBottom: '1.5rem' }}>

            {/* ── Section label ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.25rem', marginBottom: '0.9rem' }}>
                <div style={{ width: '3px', height: '16px', borderRadius: '4px', background: '#3B82F6' }} />
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
                    Article Atlas
                </span>
                <span style={{ marginLeft: 'auto', color: '#4b5563', fontSize: '0.68rem' }}>
                    {activeIdx + 1} / {articleNodes.length}
                </span>
            </div>

            {/* ── Swipeable carousel ── */}
            <div ref={trackRef} style={{
                display: 'flex', gap: '0.75rem', overflowX: 'auto',
                paddingLeft: 'calc(50vw - min(38vw, 155px))',
                paddingRight: 'calc(50vw - min(38vw, 155px))',
                paddingBottom: '1rem',
                scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab',
            }}>
                {articleNodes.map((node, i) => (
                    <div key={i} style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
                        <ShelfCard node={node} isActive={i === activeIdx}
                            onTap={() => i !== activeIdx ? scrollToCard(i) : handleCardTap(node)} />
                    </div>
                ))}
                <style>{`.mobile-shelf-track::-webkit-scrollbar{display:none}`}</style>
            </div>

            {/* ── Dot indicators ── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '0.35rem' }}>
                {articleNodes.map((_, i) => (
                    <button key={i} onClick={() => scrollToCard(i)} aria-label={`Card ${i + 1}`} style={{
                        width: i === activeIdx ? '18px' : '5px', height: '5px', borderRadius: '999px',
                        border: 'none', padding: 0, cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        background: i === activeIdx ? '#3B82F6' : 'rgba(255,255,255,0.18)',
                    }} />
                ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.62rem', color: '#374151', marginBottom: '1.75rem', fontFamily: 'Inter,sans-serif' }}>
                Swipe · Tap active card to read
            </p>

            {/* ══ MORE ARTICLES GRID ══════════════════════════════════ */}
            {gridArticles.length > 0 && (
                <div style={{ padding: '0 1rem' }}>
                    {/* Grid section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                        <div style={{ width: '3px', height: '16px', borderRadius: '4px', background: 'rgba(139,92,246,0.8)' }} />
                        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
                            More Articles
                        </span>
                    </div>

                    {/* 2-column masonry-like grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        {gridArticles.map((article, i) => (
                            <GridCard
                                key={article.id ?? i}
                                article={article}
                                // Every 5th card spans full width and is taller
                                tall={i % 5 === 2}
                            />
                        ))}
                    </div>

                    {/* Full-width wide cards interspersed (every 5th) */}
                    {/* Note: wide cards handled via tall prop above — simpler than true masonry */}
                </div>
            )}
        </div>
    )
}

export default MobileShelf
