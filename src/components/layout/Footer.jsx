// Footer Component — Newsletter + legal links
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import logoIcon from '../../assets/logo-icon.webp'
import logoIconFallback from '../../assets/logo-icon.png'

/* ══════════════════════════════════════════════════════════════
   MODAL OVERLAY COMPONENT
   (Universal Theme-Aware Overlay System)
══════════════════════════════════════════════════════════════ */
const ModalOverlay = ({ onClose, children }) => {
    const overlayRef = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleClick = (e) => { if (e.target === overlayRef.current) onClose() }

    return (
        <div ref={overlayRef} onClick={handleClick} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            animation: 'modal-fade-in 0.3s ease', padding: '1.25rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '380px',
                padding: '2rem', marginBottom: 'env(safe-area-inset-bottom, 1rem)',
                animation: 'modal-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}>
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-primary transition-all p-1 outline-none border-none bg-transparent hover:scale-110">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
            <style>{`
                @keyframes modal-fade-in { from{opacity:0} to{opacity:1} }
                @keyframes modal-slide-up { from{opacity:0;transform:translateY(30px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
                @media (min-width: 640px) {
                    div[style*="alignItems: 'flex-end'"] { align-items: center !important; }
                }
            `}</style>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════
   SHARE MODAL
══════════════════════════════════════════════════════════════ */
const ShareModal = ({ onClose }) => {
    const url = window.location.href
    const text = "Check out this technical intelligence on Flyback Electronics!"
    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(text)

    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            console.error(e)
        }
    }

    const shareLinks = [
        { name: 'X / Twitter', url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, color: 'hover:bg-primary/20 hover:text-primary hover:border-primary/50' },
        { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.126.554 4.195 1.606 6.01L.52 22.012l4.086-1.071A11.964 11.964 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 21.996c-1.803 0-3.571-.485-5.118-1.402l-.367-.217-3.037.796.812-2.96-.237-.378A9.975 9.975 0 012.012 12.03c0-5.539 4.512-10.051 10.05-10.051s10.051 4.512 10.051 10.05-4.512 10.038-10.082 10.018v.018zm5.513-7.518c-.302-.15-1.791-.884-2.069-.985-.278-.101-.482-.15-.683.15-.201.302-.782.985-.963 1.186-.18.201-.362.226-.663.076-.302-.15-1.28-.472-2.438-1.503-.902-.803-1.51-1.795-1.69-2.096-.18-.302-.02-.463.13-.614.136-.136.302-.352.453-.528.151-.176.201-.302.302-.503.1-.201.05-.377-.025-.528-.075-.15-.683-1.649-.938-2.257-.247-.59-.5-.51-.683-.52-.18-.01-.383-.01-.583-.01s-.524.075-.798.377c-.276.302-1.054 1.031-1.054 2.515s1.08 2.917 1.231 3.118c.151.201 2.124 3.243 5.144 4.545 1.581.683 2.393.593 3.292.493.818-.09 1.791-.734 2.043-1.443.251-.709.251-1.317.176-1.443-.075-.126-.276-.201-.58-.352z" /></svg>, color: 'hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/50' },
        { name: 'Telegram', url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.589.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.817.939z" /></svg>, color: 'hover:bg-[#0088cc]/20 hover:text-[#0088cc] hover:border-[#0088cc]/50' },
        { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, color: 'hover:bg-primary/20 hover:text-primary hover:border-primary/50' },
    ]

    return (
        <ModalOverlay onClose={onClose}>
            <h3 className="text-white font-display text-lg font-bold mb-5 pl-1" style={{ color: 'var(--text-primary)' }}>Share Atlas Node</h3>

            <div className="grid grid-cols-4 gap-3 mb-6 relative z-10 w-full">
                {shareLinks.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noreferrer"
                        className={`flex flex-col items-center justify-center h-14 rounded-xl bg-primary/5 border border-transparent text-secondary transition-all duration-300 outline-none ${link.color}`}
                        title={link.name}>
                        {link.icon}
                    </a>
                ))}
            </div>

            <div className="relative">
                <div className="flex items-center gap-2 bg-primary/5 border border-glass-border rounded-xl p-1.5 focus-within:border-primary/50 transition-all w-full">
                    <input type="text" readOnly value={url}
                        className="bg-transparent text-secondary text-[10px] font-mono flex-1 px-3 outline-none w-full overflow-ellipsis"
                        onClick={e => e.target.select()}
                    />
                    <button onClick={handleCopy}
                        className="bg-primary hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-primary/20 whitespace-nowrap outline-none">
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </ModalOverlay>
    )
}

/* ══════════════════════════════════════════════════════════════
   LANGUAGE MODAL
══════════════════════════════════════════════════════════════ */
const LanguageModal = ({ onClose }) => {
    return (
        <ModalOverlay onClose={onClose}>
            <div className="flex items-center gap-4 mb-6 pl-1">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-display text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Localization</h3>
                    <p className="text-secondary text-[11px] font-bold uppercase tracking-wider opacity-60">System arriving soon.</p>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 relative z-10">
                <button className="flex items-center justify-between w-full p-4 rounded-xl bg-primary/10 border border-primary/30 text-left transition-all cursor-default outline-none shadow-sm">
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>English (US)</span>
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </button>
                <div className="flex items-center justify-between w-full p-4 rounded-xl bg-primary/5 border border-transparent text-left opacity-40 pointer-events-none">
                    <span className="text-secondary font-bold text-sm">Español</span>
                    <span className="text-[9px] uppercase tracking-widest font-black text-secondary bg-primary/10 px-2 py-0.5 rounded-lg">Coming</span>
                </div>
                <div className="flex items-center justify-between w-full p-4 rounded-xl bg-primary/5 border border-transparent text-left opacity-40 pointer-events-none">
                    <span className="text-secondary font-bold text-sm">日本語</span>
                    <span className="text-[9px] uppercase tracking-widest font-black text-secondary bg-primary/10 px-2 py-0.5 rounded-lg">Coming</span>
                </div>
            </div>

            <button onClick={onClose} className="w-full mt-6 py-3.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-black uppercase tracking-widest text-[11px] transition-all outline-none border border-transparent hover:border-primary/20">
                Exit Localizer
            </button>
        </ModalOverlay>
    )
}

/* ══════════════════════════════════════════════════════════════
   MAIN FOOTER
══════════════════════════════════════════════════════════════ */
const Footer = () => {
    const [showShareModal, setShowShareModal] = useState(false)
    const [showLanguageModal, setShowLanguageModal] = useState(false)

    return (
        <footer className="mt-32 border-t border-glass-border bg-background-dark/30 backdrop-blur-3xl py-16">
            <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-10">

                {/* ── Left: Legal links ── */}
                <div className="flex items-center gap-x-8 text-[11px] font-black uppercase tracking-widest text-secondary opacity-60">
                    <Link to="/contact" className="hover:text-primary hover:opacity-100 transition-all">Contact</Link>
                    <Link to="/privacy-policy" className="hover:text-primary hover:opacity-100 transition-all">Privacy</Link>
                    <Link to="/archive" className="hover:text-primary hover:opacity-100 transition-all">Archive</Link>
                </div>

                {/* ── Right: Logo + Copyright + social icons ── */}
                <div className="text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-3 mb-4">
                        <picture>
                            <source srcSet={logoIcon} type="image/webp" />
                            <img
                                src={logoIconFallback}
                                alt="Flyback Electronics"
                                width={18}
                                height={18}
                                className="w-[18px] h-[18px] object-contain opacity-40"
                            />
                        </picture>
                        <p className="text-[10px] text-secondary font-black uppercase tracking-[0.3em] opacity-50">
                            &copy; {new Date().getFullYear()} Flyback Electronics
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-end gap-x-6">

                        {/* Twitter / X */}
                        <a href="https://twitter.com/flybackelec" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary opacity-60 hover:opacity-100 transition-all" aria-label="Twitter">
                            <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        {/* GitHub */}
                        <a href="https://github.com/flybackelectronics" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary opacity-60 hover:opacity-100 transition-all" aria-label="GitHub">
                            <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://linkedin.com/company/flybackelectronics" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary opacity-60 hover:opacity-100 transition-all" aria-label="LinkedIn">
                            <svg className="w-[17px] h-[17px]" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>

                        <button onClick={() => setShowShareModal(true)} className="text-secondary hover:text-primary opacity-60 hover:opacity-100 transition-all outline-none" aria-label="Share">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </button>

                    </div>
                </div>
            </div>

            {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
            {showLanguageModal && <LanguageModal onClose={() => setShowLanguageModal(false)} />}
        </footer>
    )
}

export default Footer
