import useSEO from '../hooks/useSEO'

const ROLES = [
    {
        title: 'Senior Technical Writer',
        type: 'Full-time · Remote',
        tags: ['Editorial', 'Technical Writing'],
        description: 'Produce long-form deep dives, explainers, and analysis pieces covering semiconductors, power electronics, and embedded systems.',
    },
    {
        title: 'Electronics Engineer (Content Advisor)',
        type: 'Contract · Part-time',
        tags: ['Hardware', 'R&D'],
        description: 'Review and fact-check technical content, contribute original insights from lab work, and advise on emerging trends in the electronics industry.',
    },
    {
        title: 'Frontend Developer',
        type: 'Full-time · Remote',
        tags: ['React', 'Vite', 'UI/UX'],
        description: 'Shape the reading experience for tens of thousands of engineers and enthusiasts. Build fast, beautiful interfaces for our growing platform.',
    },
    {
        title: 'Data & Market Analyst',
        type: 'Full-time · Remote',
        tags: ['Analysis', 'Research'],
        description: 'Translate semiconductor market data, supply-chain signals, and financial reports into actionable insights for our Analysis section.',
    },
]

const VALUES = [
    { emoji: '🔬', title: 'Depth over clickbait', body: 'We care about understanding. Every piece we publish is written by people who actually know the field.' },
    { emoji: '🌐', title: 'Remote-first', body: 'Our team is spread across the globe. We hire the best people regardless of where they live.' },
    { emoji: '⚡', title: 'Move fast & learn', body: 'We are a small, nimble team. You will have real ownership and real impact from day one.' },
    { emoji: '🤝', title: 'Transparent culture', body: 'Open salaries, open roadmaps, open feedback. No politics, just good work.' },
]

const Careers = () => {
    useSEO({
        title: 'Careers',
        description: 'Join the team building the future of tech journalism. Flyback Electronics is looking for technical writers, electronics engineers, and analysts.'
    })

    return (
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Header ── */}
            <div className="mb-16 max-w-2xl">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                    We're Hiring
                </span>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                    Build the Future of<br />
                    <span className="text-primary">Tech Journalism</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Flyback Electronics is looking for curious, technically-minded people who believe great writing can make complex engineering accessible to everyone.
                </p>
            </div>

            {/* ── Values ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                {VALUES.map(({ emoji, title, body }) => (
                    <div key={title} className="glass-panel p-6">
                        <span className="text-3xl mb-4 block">{emoji}</span>
                        <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                    </div>
                ))}
            </div>

            {/* ── Open Roles ── */}
            <h2 className="font-display text-2xl font-bold text-white mb-6">Open Positions</h2>
            <div className="space-y-4 mb-16">
                {ROLES.map(({ title, type, tags, description }) => (
                    <div
                        key={title}
                        className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center gap-5 group hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-display font-bold text-white text-lg">{title}</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{type}</p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-3">{description}</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-blue-300 bg-blue-900/30 border border-blue-500/20 rounded-full uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <a
                            href="mailto:careers@flybackelectronics.com?subject=Application"
                            className="shrink-0 bg-primary hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap shadow-lg shadow-blue-600/20"
                        >
                            Apply Now
                        </a>
                    </div>
                ))}
            </div>

            {/* ── Spontaneous application ── */}
            <div className="relative glass-panel p-10 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.4),_transparent_70%)] pointer-events-none" />
                <h2 className="font-display text-2xl font-bold text-white mb-3">Don't see your role?</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    We're always interested in hearing from talented people. Send us a note and tell us how you'd contribute.
                </p>
                <a
                    href="mailto:careers@flybackelectronics.com"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
                >
                    Send a Spontaneous Application
                </a>
            </div>
        </div>
    )
}

export default Careers
