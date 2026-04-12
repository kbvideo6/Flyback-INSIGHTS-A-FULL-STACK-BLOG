// NotFound — 404 page shown for unmatched routes
import { Link } from 'react-router-dom'
import useSEO from '../hooks/useSEO'

const NotFound = () => {
    useSEO({ title: 'Page Not Found', noindex: true })

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-32 flex flex-col items-center text-center">
            {/* Decorative glowing number */}
            <div className="relative mb-8">
                <span
                    className="font-display font-bold text-[10rem] leading-none select-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.6) 0%, rgba(139,92,246,0.4) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 60px rgba(59,130,246,0.3))',
                    }}
                >
                    404
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.12),_transparent_70%)] pointer-events-none" />
            </div>

            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                Signal Lost
            </span>

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                Page not found
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md">
                The article, page, or resource you're looking for doesn't exist or may have been moved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/"
                    className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] flex items-center gap-2"
                >
                    ← Back to Home
                </Link>
                <Link
                    to="/archive"
                    className="glass-panel px-8 py-3 rounded-full text-gray-300 hover:text-white hover:border-primary/30 font-semibold transition-all"
                >
                    Browse the Archive
                </Link>
            </div>
        </div>
    )
}

export default NotFound
