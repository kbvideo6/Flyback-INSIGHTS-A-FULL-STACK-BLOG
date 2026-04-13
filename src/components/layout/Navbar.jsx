// Navbar Component — Sticky glass-panel header
// Desktop: logo + nav links + subscribe button + search icon
// Mobile:  logo + search + hamburger → animated slide-down menu

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useNewsletter from '../../hooks/useNewsletter'
import logoIcon from '../../assets/logo-icon.webp'
import logoIconFallback from '../../assets/logo-icon.png'
import useTheme from '../../hooks/useTheme'

/* ─────────────────────────────────────────────
   Subscribe / Unsubscribe Modal
───────────────────────────────────────────── */
const SubscribeModal = ({ onClose }) => {
    const [email, setEmail] = useState('')
    const [mode, setMode] = useState('subscribe')
    const [validationErr, setValidationErr] = useState('')

    const overlayRef = useRef(null)
    const inputRef = useRef(null)
    const { subscribe, unsubscribe, status, message, reset } = useNewsletter()

    useEffect(() => { inputRef.current?.focus() }, [])

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose() }

    const handleModeSwitch = (m) => { setMode(m); setValidationErr(''); reset() }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidationErr('')
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setValidationErr('Please enter a valid email address.')
            return
        }
        if (mode === 'subscribe') await subscribe(email)
        else await unsubscribe(email)
    }

    const isLoading = status === 'loading'
    const isSuccess = status === 'success'
    const isError = status === 'error' || validationErr

    return (
        <div ref={overlayRef} onClick={handleOverlayClick} style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            animation: 'modal-fade-in 0.3s ease',
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '440px', margin: '0 1.25rem',
                padding: '2.5rem 2.25rem',
                animation: 'modal-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {/* Close */}
                <button onClick={onClose} aria-label="Close" style={{
                    position: 'absolute', top: '1.25rem', right: '1.25rem',
                    background: 'var(--glass-tint)', border: '1px solid var(--glass-border)',
                    borderRadius: '50%', width: '2.5rem', height: '2.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; e.currentTarget.style.color = 'var(--accent-blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.0)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon + title */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '3.75rem', height: '3.75rem', borderRadius: '1.25rem',
                        background: 'linear-gradient(135deg, var(--accent-blue) 0%, #1e40af 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', boxShadow: '0 12px 24px rgba(49,130,206,0.25)',
                    }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                        {mode === 'subscribe' ? 'Technical Intelligence' : 'Unsubscribe'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.6rem', lineHeight: 1.6 }}>
                        {mode === 'subscribe' ? 'Get engineered insights delivered to your terminal inbox.' : "Adjusting your frequency parameters."}
                    </p>
                </div>

                {/* Mode tabs */}
                <div style={{
                    display: 'flex', background: 'var(--glass-tint)',
                    border: '1px solid var(--glass-border)', borderRadius: '1.25rem',
                    padding: '0.35rem', marginBottom: '1.75rem',
                }}>
                    {['subscribe', 'unsubscribe'].map((m) => (
                        <button key={m} onClick={() => handleModeSwitch(m)} style={{
                            flex: 1, padding: '0.75rem', borderRadius: '1rem', border: 'none',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                            fontWeight: 800, textTransform: 'uppercase', tracking: '0.05em', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            background: mode === m ? 'var(--accent-blue)' : 'transparent',
                            color: mode === m ? '#fff' : 'var(--text-secondary)',
                            boxShadow: mode === m ? '0 6px 16px rgba(49,130,206,0.3)' : 'none',
                        }}>{m}</button>
                    ))}
                </div>

                {/* Success */}
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
                        <div style={{
                            width: '4rem', height: '4rem', borderRadius: '50%',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
                        }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>{message}</p>
                        <button onClick={onClose} className="btn-primary" style={{ marginTop: '2rem', width: '100%', py: '1rem' }}>Terminate Interface</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                            <input
                                ref={inputRef} id="subscribe-email" type="email"
                                value={email} placeholder="ARCHIVE@FLYBACK.IO" required disabled={isLoading}
                                onChange={(e) => { setEmail(e.target.value.toUpperCase()); setValidationErr(''); if (status === 'error') reset() }}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem',
                                    background: 'var(--glass-tint)', borderRadius: '1.25rem', color: 'var(--text-primary)',
                                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', outline: 'none',
                                    boxSizing: 'border-box', transition: 'all 0.3s ease',
                                    opacity: isLoading ? 0.6 : 1,
                                    border: isError ? '1.5px solid #ef4444' : '1.5px solid var(--glass-border)',
                                }}
                            />
                            <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }}
                                width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-primary)" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        {(validationErr || status === 'error') && (
                            <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.25rem', marginTop: '-0.75rem', textAlign: 'center', textTransform: 'uppercase' }}>
                                ERR: {validationErr || message}
                            </p>
                        )}
                        <button id="subscribe-submit-btn" type="submit" disabled={isLoading} className="btn-primary w-full py-4 shadow-2xl">
                            {isLoading ? 'Decrypting...' : (mode === 'subscribe' ? 'Establish Feed' : 'Terminate')}
                        </button>
                    </form>
                )}
                {!isSuccess && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', marginTop: '1.5rem', opacity: 0.5, letterSpacing: '0.1em' }}>
                        ZERO LATENCY SPAM POLICY ACTIVE.
                    </p>
                )}
            </div>
            <style>{`
                @keyframes modal-fade-in { from{opacity:0} to{opacity:1} }
                @keyframes modal-slide-up { from{opacity:0;transform:scale(0.92) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
                #subscribe-email::placeholder{color:var(--text-secondary);opacity:0.3}
            `}</style>
        </div>
    )
}

/* ─────────────────────────────────────────────
   Mobile Menu Drawer
───────────────────────────────────────────── */
const NAV_LINKS = [
    { to: '/topics', label: 'Topics', icon: '📡' },
    { to: '/deep-dives', label: 'Deep Dives', icon: '🔬' },
    { to: '/analysis', label: 'Analysis', icon: '📊' },
    { to: '/about', label: 'About', icon: '👤' },
    { to: '/contact', label: 'Contact', icon: '✉️' },
]

const ThemeToggle = ({ theme, toggleTheme, className = "" }) => (
    <button
        onClick={toggleTheme}
        className={`p-2 transition-all hover:text-primary hover:scale-110 active:scale-95 outline-none ${className}`}
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        )}
    </button>
)

const MobileMenu = ({ isOpen, onClose, onSubscribe, theme, toggleTheme }) => {
    const location = useLocation()

    useEffect(() => { onClose() }, [location.pathname, onClose])

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 998,
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease',
                }}
            />

            {/* Slide-down drawer */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 999,
                background: 'var(--glass-surface)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                borderBottom: '1px solid var(--glass-border)',
                borderRadius: '0 0 3rem 3rem',
                transform: isOpen ? 'translateY(0)' : 'translateY(-115%)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                paddingTop: '100px',
                paddingBottom: '2.5rem',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2)',
            }}>
                <div className="flex justify-between items-center px-10 mb-6">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary opacity-50">Global Navigation</span>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="bg-primary/5 rounded-2xl p-3" />
                </div>
                
                <nav style={{ padding: '0 2rem 2rem' }}>
                    {NAV_LINKS.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                padding: '1.5rem 2rem',
                                borderRadius: '1.5rem',
                                color: 'var(--text-primary)',
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontWeight: 800,
                                fontSize: '1.2rem',
                                textDecoration: 'none',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                marginBottom: '0.4rem',
                            }}
                            className="hover:bg-primary/5 hover:translate-x-2 active:scale-95"
                        >
                            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                            {label}
                            <svg style={{ marginLeft: 'auto', opacity: 0.4 }} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '0 2rem' }}>
                    <button
                        onClick={() => { onClose(); onSubscribe() }}
                        className="btn-primary w-full py-5 text-[11px] font-black shadow-3xl hover:scale-[1.02]"
                    >
                        Establish Technical Feed
                    </button>
                </div>
            </div>
        </>
    )
}

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
const Navbar = () => {
    const [showSubscribe, setShowSubscribe] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    const closeMenu = useCallback(() => setMenuOpen(false), [])

    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 1024) closeMenu() }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [closeMenu])

    return (
        <>
            <nav className="sticky top-6 z-[100] mx-4 lg:mx-16 mt-6 glass-panel">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* ── Left: Logo ── */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group shrink-0"
                        aria-label="Flyback Electronics — Home"
                    >
                        <picture>
                            <source srcSet={logoIcon} type="image/webp" />
                            <img
                                src={logoIconFallback}
                                alt="Flyback Electronics logo"
                                width={38}
                                height={38}
                                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_18px_rgba(59,130,246,0.6)] transition-all duration-500"
                            />
                        </picture>
                        <span className="font-display font-bold text-2xl tracking-tight leading-none">
                            <span style={{ color: 'var(--logo-color)' }}>Flyback</span>
                            {' '}
                            <span className="text-primary italic font-normal">Electronics</span>
                        </span>
                    </Link>

                    {/* ── Center: Nav links (desktop only) ── */}
                    <div className="hidden lg:flex items-center gap-x-10 text-xs font-black uppercase tracking-[0.15em]">
                        {NAV_LINKS.slice(0, 3).map(({ to, label }) => (
                            <Link key={to} to={to} className="text-current hover:text-primary transition-all hover:-translate-y-0.5">{label}</Link>
                        ))}
                        <a 
                            href="https://www.fiverr.com/s/your-profile-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-white border-2 border-primary/20 hover:bg-primary px-5 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                        >
                            Hire Consultant
                        </a>
                        <button
                            id="navbar-subscribe-btn"
                            onClick={() => setShowSubscribe(true)}
                            className="btn-primary"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* ── Right: Icons ── */}
                    <div className="flex items-center gap-x-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="hidden lg:block" />
                        
                        {/* Search / Archive */}
                        <Link to="/archive" className="hover:text-primary transition-all p-1.5 hover:scale-110" aria-label="Archive">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </Link>

                        {/* Hamburger (mobile only) */}
                        <button
                            id="mobile-menu-btn"
                            className="lg:hidden hover:text-primary transition-colors p-1.5 relative w-7 h-7"
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(o => !o)}
                        >
                            <span style={{
                                position: 'absolute', left: '15%', top: '25%', width: '70%', height: '2.5px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                            }} />
                            <span style={{
                                position: 'absolute', left: '15%', top: '50%', width: '70%', height: '2.5px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'opacity 0.2s ease',
                                opacity: menuOpen ? 0 : 1,
                            }} />
                            <span style={{
                                position: 'absolute', left: '15%', top: '75%', width: '70%', height: '2.5px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                            }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile slide-down menu */}
            <MobileMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onSubscribe={() => setShowSubscribe(true)}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            {/* Subscribe modal */}
            {showSubscribe && <SubscribeModal onClose={() => setShowSubscribe(false)} />}
        </>
    )
}

export default Navbar
