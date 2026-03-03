// HeroNode — The central "Deep Dive" card (clickable, links to article page)
import { Link } from 'react-router-dom'

const HeroNode = ({ slug = 'the-silicon-brain-a-deep-dive-into-ai-accelerators' }) => {
    return (
        <Link to={`/article/${slug}`}>
            <section className="group cursor-pointer relative">
                {/* ── Outer glow on hover ── */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

                {/* ── Card body ── */}
                <div className="relative overflow-hidden rounded-3xl glass-panel shadow-2xl border-white/10 transition-transform duration-500 group-hover:scale-[1.01]">
                    <div className="aspect-[16/9] relative">

                        {/* ── Background image placeholder ── */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-slate-900 to-gray-950">
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.3),_transparent_60%)]" />
                        </div>

                        {/* ── Gradient overlay: dark at bottom → transparent at top ── */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent" />

                        {/* ── Text content ── */}
                        <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end">
                            {/* Tag / Badge */}
                            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 backdrop-blur-md border border-blue-500/30 rounded-full w-fit">
                                CENTRAL NODE: DEEP DIVE
                            </span>

                            {/* Heading */}
                            <h1 className="font-display font-bold text-3xl lg:text-5xl text-white leading-tight mb-4">
                                The Silicon Brain: A Deep Dive into AI Accelerators
                            </h1>

                            {/* Description */}
                            <p className="text-gray-300 text-base lg:text-lg mb-6 max-w-xl line-clamp-2">
                                From neuromorphic computing to photonic chips, exploring the cutting-edge engineering.
                            </p>

                            {/* CTA Button */}
                            <span className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
                                Explore Neural Architecture
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.93 14.93 0 01-5.96 2.58m0 0a14.9 14.9 0 01-6.16 1.42m6.16-1.42L9.63 8.41m0 0L3.47 6.25" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </Link>
    )
}

export default HeroNode
