// About Page — Authority branding for Electronic & Embedded System Design Engineer
import useSEO from '../hooks/useSEO'

const SPECIALTIES = [
    {
        icon: '📐',
        title: 'PCB Design & Layout',
        body: 'High-speed digital, mixed-signal, and power electronics layout with a focus on DFM (Design for Manufacturing) and signal integrity.',
    },
    {
        icon: '💻',
        title: 'Embedded Firmware',
        body: 'Expertise in C/C++, RTOS, and bare-metal programming for ARM Cortex-M, ESP32, and specialized industrial controllers.',
    },
    {
        icon: '🛠',
        title: 'Manufacturing & PCBA',
        body: 'End-to-end expertise in BOM optimization, sourcing, and managing the assembly process with overseas and local manufacturers.',
    },
    {
        icon: '⚛',
        title: 'Full-Stack Integration',
        body: 'Building the bridge between hardware and the web using the MERN stack for industrial IoT dashboards and control systems.',
    },
]

const About = () => {
    useSEO({ title: 'About the Engineer', description: 'Meet the lead engineer behind Flyback Electronics — an expert in Electronic & Embedded System Design and MERN stack development.' })

    return (
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Hero / Authority Section ── */}
            <div className="flex flex-col lg:flex-row gap-12 mb-24 items-center">
                <div className="lg:w-2/3">
                    <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                        The Lead Engineer
                    </span>
                    <h1 className="font-display text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        Bridging the gap between <br />
                        <span className="text-primary italic">Silicon and Software.</span>
                    </h1>
                    <p className="text-gray-200 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
                        I am an <strong>Electronic and Embedded System Design Engineer</strong> specializing in the full lifecycle of electronic products—from initial schematic design and PCB layout to embedded firmware and full-stack MERN dashboards.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://www.fiverr.com/s/your-profile-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl shadow-blue-600/30"
                        >
                            Hire me on Fiverr
                        </a>
                        <a
                            href="/contact"
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>

                {/* Profile "Avatar" Visual */}
                <div className="lg:w-1/3 w-full">
                    <div className="relative aspect-square glass-panel flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 group-hover:opacity-40 transition-opacity" />
                        <span className="text-8x font-display font-bold text-white/10 select-none">FLYBACK</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
                             <span className="text-6xl">🔧</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Expertise Pillars ── */}
            <div className="mb-24">
                <h2 className="font-display text-3xl font-bold text-white mb-10 text-center lg:text-left">Core Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SPECIALTIES.map(({ icon, title, body }) => (
                        <div key={title} className="glass-panel p-8 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">{icon}</div>
                            <h3 className="font-display font-bold text-xl text-white mb-3 flex items-center gap-3">
                                {title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                {body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── The Philosophy ── */}
            <div className="relative glass-panel p-10 lg:p-16 mb-24 overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-xs font-bold tracking-[0.3em] text-blue-400 uppercase mb-6">Service Philosophy</p>
                    <p className="font-display text-2xl lg:text-4xl font-bold text-white leading-tight italic">
                        "I don't just design circuits; I design systems that solve problems reliably and elegantly."
                    </p>
                    <div className="mt-10 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">50+</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Designs Shipped</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Final CTA ── */}
            <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10 rounded-3xl p-12 text-center">
                <h2 className="font-display text-3xl font-bold text-white mb-4">Start Your Project Today</h2>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                    Looking for a dedicated engineer to handle your PCB layout, firmware, or full-stack IoT dashboard? Let's turn your concept into reality.
                </p>
                <a
                    href="https://www.fiverr.com/s/your-profile-link"
                    className="inline-flex items-center gap-2 bg-white text-gray-950 font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition-colors shadow-2xl"
                >
                    Book a Consult on Fiverr
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

export default About
