// TrendNode — Sidebar data cards ("Vector Trends" / "Signal Analysis")
// Props:
//   variant  – 'trends' | 'analysis'
//   trends   – array of { id, label, meta } from useTrends() (trends variant only)

const FALLBACK_TRENDS = [
    { id: 1, label: 'Quantum Sensors', meta: 'High Frequency Interaction' },
    { id: 2, label: 'Bio-inspired Electronics', meta: 'Emerging Sub-field' },
]

const TrendNode = ({ variant = 'trends', trends }) => {
    const items = trends?.length ? trends : FALLBACK_TRENDS

    if (variant === 'analysis') {
        return (
            <aside className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                        SIGNAL ANALYSIS
                    </h4>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div>
                    <h5 className="font-display font-bold text-white text-lg mb-1">AI Chip Market Growth</h5>
                    <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">Projected value in Billions (USD) across Tier-1 manufacturers.</p>
                    <div className="relative h-24 w-full border-l border-b border-white/10 flex items-end">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                            <path d="M0,45 Q20,40 40,30 T100,5 L100,50 L0,50 Z" fill="rgba(59,130,246,0.15)" />
                            <path d="M0,45 Q20,40 40,30 T100,5" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
                        </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                        <span>2024 (Actual)</span>
                        <span>2028 (Forecast)</span>
                    </div>
                </div>
            </aside>
        )
    }

    // Default: "trends" variant — renders live trends list
    return (
        <aside className="glass-panel p-6">
            <h4 className="text-xs font-bold tracking-[0.25em] text-blue-400 uppercase mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                VECTOR TRENDS
            </h4>
            <ul className="space-y-5">
                {items.map((trend) => (
                    <li key={trend.id}>
                        <a href="#" className="flex flex-col group">
                            <span className="text-white group-hover:text-primary transition-colors font-semibold text-sm">
                                {trend.label}
                            </span>
                            <span className="text-[11px] text-gray-300 leading-relaxed mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                {trend.meta}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default TrendNode
