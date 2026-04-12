// About Page — Flyback Electronics mission, team, and story
import useSEO from '../hooks/useSEO'

const TEAM = [
    {
        name: 'Dr. Aisha Patel',
        role: 'Editor-in-Chief',
        bio: 'Former semiconductor researcher at MIT Lincoln Laboratory. Expert in RF systems, power electronics, and photonics.',
        initial: 'A',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        name: 'Marcus Wren',
        role: 'Senior Technical Writer',
        bio: 'Embedded systems engineer turned journalist. 10+ years shipping real hardware before switching to explaining it to the world.',
        initial: 'M',
        gradient: 'from-purple-500 to-pink-600',
    },
    {
        name: 'Lena Kovač',
        role: 'Data & Market Analyst',
        bio: 'Quantitative analyst specialising in semiconductor supply chains, fab economics, and silicon market forecasting.',
        initial: 'L',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        name: 'Ryo Tanaka',
        role: 'AI & Robotics Editor',
        bio: 'Robotics PhD from ETH Zürich. Writes at the intersection of physical intelligence, motor control, and edge AI.',
        initial: 'R',
        gradient: 'from-orange-500 to-red-600',
    },
]

const PILLARS = [
    {
        icon: '🔬',
        title: 'Rigorous depth',
        body: 'Every article is written by engineers and researchers who have shipped real hardware or published peer-reviewed work. No filler, no buzzwords.',
    },
    {
        icon: '🌐',
        title: 'Global perspective',
        body: 'From TSMC fabs to European chip design houses to Silicon Valley AI labs — we report on the entire electronics ecosystem.',
    },
    {
        icon: '📊',
        title: 'Data-driven analysis',
        body: 'Our market analysis is backed by primary data, earnings reports, and supply-chain signals — not press releases.',
    },
    {
        icon: '⚡',
        title: 'Fast, accurate',
        body: 'Breaking news, emerging trends, and deep dives delivered with the speed of a news desk and the accuracy of a technical journal.',
    },
]

const About = () => {
    useSEO({ title: 'About', description: 'Meet the Flyback Electronics team — semiconductor researchers, embedded engineers, and market analysts making electronics accessible to everyone.' })

    return (
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Hero ── */}
            <div className="mb-20 max-w-3xl">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                    Our Story
                </span>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Electronics explained<br />
                    <span className="text-primary">by people who build it.</span>
                </h1>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-2xl">
                    Flyback Electronics is an independent publication dedicated to making the complex world of electronics, semiconductors, AI, and robotics accessible to engineers, makers, and curious minds everywhere.
                </p>
            </div>

            {/* ── Mission ── */}
            <div className="relative glass-panel p-8 lg:p-12 mb-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.5),_transparent_60%)] pointer-events-none" />
                <div className="relative">
                    <p className="text-xs font-bold tracking-[0.2em] text-blue-300 uppercase mb-4">Mission</p>
                    <p className="font-display text-2xl lg:text-3xl font-bold text-white leading-snug max-w-3xl">
                        "We believe the world works better when more people understand how electronics work — from the silicon crystal to the system that talks to the world."
                    </p>
                    <p className="text-gray-500 text-sm mt-6">— Flyback Electronics Editorial Charter, 2024</p>
                </div>
            </div>

            {/* ── Pillars ── */}
            <div className="mb-20">
                <h2 className="font-display text-2xl font-bold text-white mb-8">What we stand for</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {PILLARS.map(({ icon, title, body }) => (
                        <div key={title} className="glass-panel p-7 group hover:border-primary/30 transition-all duration-300">
                            <span className="text-3xl mb-4 block">{icon}</span>
                            <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Team ── */}
            <div className="mb-20">
                <h2 className="font-display text-2xl font-bold text-white mb-8">Meet the team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {TEAM.map(({ name, role, bio, initial, gradient }) => (
                        <div key={name} className="glass-panel p-6 flex gap-5 group hover:border-primary/20 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}>
                                {initial}
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-white text-lg leading-tight">{name}</h3>
                                <p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-2">{role}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="relative glass-panel p-10 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.5),_transparent_70%)] pointer-events-none" />
                <h2 className="font-display text-2xl font-bold text-white mb-3">Want to contribute?</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    We accept pitches from engineers, researchers, and technical writers. If you have expertise and a story to tell, we want to hear from you.
                </p>
                <a
                    href="mailto:editorial@flybackelectronics.com"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg shadow-blue-600/20"
                >
                    Submit a Pitch
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default About
