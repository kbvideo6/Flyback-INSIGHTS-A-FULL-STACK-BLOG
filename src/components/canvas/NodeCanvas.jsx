// NodeCanvas — Spatial container for all nodes, driven by useCanvasData()
// Desktop: absolute positioning with SVG connection lines
// Mobile:  horizontal swipeable bookshelf (MobileShelf)

import HeroNode from '../nodes/HeroNode'
import StandardNode from '../nodes/StandardNode'
import TrendNode from '../nodes/TrendNode'
import MobileShelf from './MobileShelf'
import useCanvasData from '../../hooks/useCanvasData'
import useTrends from '../../hooks/useTrends'

// Convert a position descriptor from the API into an inline style object
const positionToStyle = (pos) => {
    if (!pos) return {}
    const { top, left, right, bottom, width, maxWidth, center } = pos
    return {
        ...(top !== undefined && { top }),
        ...(left !== undefined && { left }),
        ...(right !== undefined && { right }),
        ...(bottom !== undefined && { bottom }),
        ...(width !== undefined && { width }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(center && { transform: 'translateX(-50%)', left: '50%', top: '10%' }),
    }
}

const NodeCanvas = () => {
    const { nodes, edges, isLoading } = useCanvasData()
    const { trends } = useTrends()

    return (
        <>
            {/* ══════════════════════════════════════════
                MOBILE  — Horizontal bookshelf
            ══════════════════════════════════════════ */}
            <div className="lg:hidden w-full py-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-600 text-sm">Loading articles…</span>
                    </div>
                ) : (
                    <MobileShelf nodes={nodes ?? []} />
                )}
            </div>

            {/* ══════════════════════════════════════════
                DESKTOP — Absolute canvas with SVG lines
            ══════════════════════════════════════════ */}
            <div className="hidden lg:block absolute inset-0">

                {/* ── Background ambient glow ── */}
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[140px] pointer-events-none" />

                {/* ── Subtle technical grid overlay ── */}
                <div
                    className="absolute inset-0 opacity-[0.2] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, var(--text-primary) 0.5px, transparent 0.5px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                {/* ── SVG connection lines ── */}
                {edges?.length > 0 && (
                    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-50">
                        {edges.map((edge, i) => (
                            <line
                                key={i}
                                x1={edge.x1} y1={edge.y1}
                                x2={edge.x2} y2={edge.y2}
                                stroke="url(#line-grad)"
                                strokeWidth="1"
                            />
                        ))}
                        <defs>
                            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="var(--accent-blue)" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                )}

                {/* ── Loading skeleton ── */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Neural Map…</span>
                    </div>
                )}

                {/* ── Dynamic nodes ── */}
                {nodes?.map((node, i) => {
                    const posStyle = positionToStyle(node.position ?? {})
                    const wrapperClass = `absolute z-10 ${node.type === 'hero' ? 'z-20' : ''}`

                    if (node.type === 'hero') {
                        return (
                            <div key={i} className={wrapperClass} style={posStyle}>
                                <HeroNode
                                    slug={node.slug}
                                    title={node.title}
                                    excerpt={node.excerpt}
                                    coverImageUrl={node.coverImageUrl}
                                />
                            </div>
                        )
                    }

                    if (node.type === 'standard') {
                        return (
                            <div key={i} className={wrapperClass} style={posStyle}>
                                <StandardNode
                                    slug={node.slug}
                                    title={node.title}
                                    description={node.description}
                                    coverImageUrl={node.coverImageUrl}
                                />
                            </div>
                        )
                    }

                    if (node.type === 'trend') {
                        return (
                            <div key={i} className={wrapperClass} style={posStyle}>
                                <TrendNode
                                    variant={node.variant ?? 'trends'}
                                    trends={node.variant === 'trends' ? trends : undefined}
                                />
                            </div>
                        )
                    }

                    return null
                })}
            </div>
        </>
    )
}

export default NodeCanvas
