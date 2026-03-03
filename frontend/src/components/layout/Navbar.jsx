// Navbar Component — Sticky glass-panel header
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="sticky top-4 z-50 mx-4 lg:mx-12 mt-4 glass-panel">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* ── Left: Logo ── */}
                <Link
                    to="/"
                    className="font-display font-bold text-2xl tracking-tight text-white hover:text-primary transition-colors"
                >
                    Flyback{' '}
                    <span className="text-primary font-normal italic">INSIGHTS</span>
                </Link>

                {/* ── Center: Navigation links (hidden on mobile) ── */}
                <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
                    <Link to="/topics" className="text-gray-300 hover:text-primary transition-colors">
                        Topics
                    </Link>
                    <Link to="/DeepDives" className="text-gray-300 hover:text-primary transition-colors">
                        Deep Dives
                    </Link>
                    <Link to="/Analysis" className="text-gray-300 hover:text-primary transition-colors">
                        Analysis
                    </Link>
                    <Link
                        to="/contact"
                        className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full transition-colors"
                    >
                        Subscribe
                    </Link>
                </div>

                {/* ── Right: Icons ── */}
                <div className="flex items-center gap-x-4 text-gray-300">
                    <button className="hover:text-primary transition-colors" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </button>
                    {/* Mobile hamburger */}
                    <button className="md:hidden hover:text-primary transition-colors" aria-label="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
