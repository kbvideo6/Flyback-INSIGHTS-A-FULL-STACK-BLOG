// NodeCanvas — Spatial container for all nodes, driven by useCanvasData()
// Desktop: absolute positioning with SVG connection lines
// Mobile:  flex column stack, SVG lines hidden

import HeroNode from '../nodes/HeroNode'
import StandardNode from '../nodes/StandardNode'
import TrendNode from '../nodes/TrendNode'
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
        <div className="flex flex-col gap-6 px-4 lg:px-0 lg:absolute lg:inset-0 lg:block">

            {/* ── Background ambient glow ── */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />

            {/* ── Subtle dot grid overlay ── */}
            <div
                className="hidden lg:block absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* ── SVG connection lines (desktop only) ── */}
            {edges?.length > 0 && (
                <svg className="hidden lg:block absolute inset-0 w-full h-full z-0 pointer-events-none">
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
                            <stop offset="50%" stopColor="rgba(59,130,246,0.2)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {/* ── Loading skeleton ── */}
            {isLoading && (
                <div className="hidden lg:flex absolute inset-0 items-center justify-center">
                    <span className="text-gray-600 text-sm animate-pulse">Loading canvas…</span>
                </div>
            )}

            {/* ── Dynamic nodes ── */}
            {nodes?.map((node, i) => {
                const posStyle = positionToStyle(node.position ?? {})
                const wrapperClass = `lg:absolute z-10 ${node.type === 'hero' ? 'z-20' : ''}`

                if (node.type === 'hero') {
                    return (
                        <div key={i} className={wrapperClass} style={posStyle}>
                            <HeroNode slug={node.slug} />
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
    )
}

export default NodeCanvas
