// Footer Component — Newsletter + legal links
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/logo-icon.webp'
import logoIconFallback from '../../assets/logo-icon.png'

const Footer = () => {
    const [shareState, setShareState] = useState('idle')

    const handleShare = async (e) => {
        e.preventDefault()
        try {
            await navigator.clipboard.writeText(window.location.href)
            setShareState('copied')
            setTimeout(() => setShareState('idle'), 2000)
        } catch (err) {
            console.log('Clipboard API failed', err)
        }
    }

    const handleLanguage = (e) => {
        e.preventDefault()
        alert('🌐 Localization and multi-language support is arriving in our next major update!')
    }

    return (
        <footer className="mt-24 border-t border-glass-border bg-black/40 backdrop-blur-2xl py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* ── Left: Legal links ── */}
                <div className="flex items-center gap-x-6 text-xs font-medium text-gray-500">
                    <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
                    <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link to="/archive" className="hover:text-primary transition-colors">Archive Atlas</Link>
                </div>

                {/* ── Right: Logo + Copyright + social icons ── */}
                <div className="text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                        <picture>
                            <source srcSet={logoIcon} type="image/webp" />
                            <img
                                src={logoIconFallback}
                                alt="Flyback Electronics"
                                width={18}
                                height={18}
                                className="w-[18px] h-[18px] object-contain opacity-50"
                            />
                        </picture>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} Flyback Electronics
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-end gap-x-5">

                        {/* Twitter / X */}
                        <a href="https://twitter.com/flybackelec" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="Twitter">
                            <svg className="w-[14px] h-[14px]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        {/* GitHub */}
                        <a href="https://github.com/flybackelectronics" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="GitHub">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://linkedin.com/company/flybackelectronics" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* Share Page (copies URL) */}
                        <button onClick={handleShare} className="relative text-gray-500 hover:text-primary transition-colors flex items-center justify-center outline-none" aria-label="Share">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            {shareState === 'copied' && (
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded shadow-lg whitespace-nowrap animate-bounce font-medium tracking-wide">
                                    Link Copied!
                                </span>
                            )}
                        </button>

                        {/* Language */}
                        <button onClick={handleLanguage} className="text-gray-500 hover:text-primary transition-colors flex items-center justify-center outline-none" aria-label="Language">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </button>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
