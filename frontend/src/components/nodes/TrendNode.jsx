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
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                        SIGNAL ANALYSIS
                    </h4>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div>
                    <h5 className="font-display font-bold text-white text-lg mb-2">AI Chip Market Growth</h5>
                    <div className="relative h-24 w-full border-l border-b border-gray-700/50 flex items-end">
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
            </aside>
        )
    }

    // Default: "trends" variant — renders live trends list
    return (
        <aside className="glass-panel p-6">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 border-b border-white/5 pb-2">
                VECTOR TRENDS
            </h4>
            <ul className="space-y-4">
                {items.map((trend) => (
                    <li key={trend.id}>
                        <a href="#" className="flex flex-col group">
                            <span className="text-white group-hover:text-primary transition-colors font-medium">
                                {trend.label}
                            </span>
                            <span className="text-[10px] text-gray-500">{trend.meta}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default TrendNode
