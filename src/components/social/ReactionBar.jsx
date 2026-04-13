// ReactionBar — Technical sentiment icons for articles
import { useState } from 'react'

const REACTIONS = [
    { type: 'insight', emoji: '💡', label: 'Insightful' },
    { type: 'hardware', emoji: '🔬', label: 'Technical' },
    { type: 'performance', emoji: '🚀', label: 'Performant' },
    { type: 'complex', emoji: '🤯', label: 'Complex' },
    { type: 'legacy', emoji: '💾', label: 'Solid' },
]

const ReactionBar = ({ counts = {}, onReact }) => {
    const [reactedTypes, setReactedTypes] = useState(new Set())

    const handleReact = (type) => {
        if (reactedTypes.has(type)) return // limit to one per type per session
        onReact(type)
        setReactedTypes(new Set([...reactedTypes, type]))
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {REACTIONS.map(({ type, emoji, label }) => {
                const count = counts[type] || 0
                const hasReacted = reactedTypes.has(type)

                return (
                    <button
                        key={type}
                        onClick={() => handleReact(type)}
                        className={`
                            group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                            border ${hasReacted 
                                ? 'bg-primary/20 border-primary/50 text-white' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'}
                        `}
                        title={label}
                    >
                        <span className={`text-lg ${hasReacted ? 'animate-bounce' : 'group-hover:scale-120 transition-transform'}`}>
                            {emoji}
                        </span>
                        <span className="text-xs font-bold font-mono">
                            {count > 0 ? count : ''}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export default ReactionBar
