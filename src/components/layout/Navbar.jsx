// Navbar Component — Sticky glass-panel header
// Desktop: logo + nav links + subscribe button + search icon
// Mobile:  logo + search + hamburger → animated slide-down menu

import { useState, useEffect, useRef } from 'react'
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
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            animation: 'modal-fade-in 0.2s ease',
        }}>
            <div style={{
                position: 'relative', width: '100%', maxWidth: '420px', margin: '0 1rem',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.14)', borderRadius: '1.5rem',
                padding: '2.25rem 2rem 2rem',
                boxShadow: '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
                animation: 'modal-slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                color: '#e5e7eb', fontFamily: 'Inter, sans-serif',
            }}>
                {/* Close */}
                <button onClick={onClose} aria-label="Close" style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '50%', width: '2rem', height: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#9ca3af', transition: 'background 0.2s, color 0.2s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9ca3af' }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon + title */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '3.25rem', height: '3.25rem', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1d4ed8 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', boxShadow: '0 0 24px rgba(59,130,246,0.45)',
                    }}>
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.45rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                        {mode === 'subscribe' ? 'Stay in the Loop' : 'Unsubscribe'}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.4rem' }}>
                        {mode === 'subscribe' ? 'Get the latest electronics insights delivered to your inbox.' : "We're sorry to see you go."}
                    </p>
                </div>

                {/* Mode tabs */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)', borderRadius: '0.75rem',
                    padding: '0.2rem', marginBottom: '1.25rem',
                }}>
                    {['subscribe', 'unsubscribe'].map((m) => (
                        <button key={m} onClick={() => handleModeSwitch(m)} style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.6rem', border: 'none',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
                            fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
                            background: mode === m ? '#3B82F6' : 'transparent',
                            color: mode === m ? '#fff' : '#9ca3af',
                            boxShadow: mode === m ? '0 2px 8px rgba(59,130,246,0.4)' : 'none',
                        }}>{m}</button>
                    ))}
                </div>

                {/* Success */}
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '0.75rem 0 0.5rem' }}>
                        <div style={{
                            width: '3rem', height: '3rem', borderRadius: '50%',
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem',
                        }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p style={{ color: '#d1fae5', fontSize: '0.9rem', lineHeight: 1.55 }}>{message}</p>
                        <button onClick={onClose} style={{
                            marginTop: '1.25rem', padding: '0.6rem 2rem',
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '0.65rem', color: '#e5e7eb', fontFamily: 'Inter, sans-serif',
                            fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        >Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                            <input
                                ref={inputRef} id="subscribe-email" type="email"
                                value={email} placeholder="your@email.com" required disabled={isLoading}
                                onChange={(e) => { setEmail(e.target.value); setValidationErr(''); if (status === 'error') reset() }}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    background: 'rgba(255,255,255,0.07)', borderRadius: '0.75rem', color: '#e5e7eb',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none',
                                    boxSizing: 'border-box', transition: 'border-color 0.2s, opacity 0.2s',
                                    opacity: isLoading ? 0.6 : 1,
                                    border: isError ? '1px solid rgba(239,68,68,0.7)' : '1px solid rgba(255,255,255,0.12)',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)' }}
                                onBlur={e => { e.target.style.borderColor = isError ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.12)' }}
                            />
                            <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.45, pointerEvents: 'none' }}
                                width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#e5e7eb" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        {(validationErr || status === 'error') && (
                            <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem', marginTop: '-0.4rem', lineHeight: 1.4 }}>
                                {validationErr || message}
                            </p>
                        )}
                        <button id="subscribe-submit-btn" type="submit" disabled={isLoading} style={{
                            width: '100%', padding: '0.8rem',
                            background: isLoading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3B82F6 0%, #1d4ed8 100%)',
                            border: 'none', borderRadius: '0.75rem', color: '#fff',
                            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 16px rgba(59,130,246,0.4)', transition: 'opacity 0.2s, transform 0.15s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        }}
                            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.01)' } }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                        >
                            {isLoading ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    Please wait…
                                </>
                            ) : (mode === 'subscribe' ? 'Subscribe Now' : 'Unsubscribe')}
                        </button>
                    </form>
                )}
                {!isSuccess && (
                    <p style={{ color: '#6b7280', fontSize: '0.72rem', textAlign: 'center', marginTop: '1rem' }}>
                        No spam, ever. Unsubscribe at any time.
                    </p>
                )}
            </div>
            <style>{`
                @keyframes modal-fade-in { from{opacity:0} to{opacity:1} }
                @keyframes modal-slide-up { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes spin { to{transform:rotate(360deg)} }
                #subscribe-email::placeholder{color:#6b7280}
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
        className={`p-2 transition-colors hover:text-primary outline-none ${className}`}
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        )}
    </button>
)

const MobileMenu = ({ isOpen, onClose, onSubscribe, theme, toggleTheme }) => {
    const location = useLocation()

    // Close menu whenever the route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onClose() }, [location.pathname])

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 998,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Slide-down drawer */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 999,
                background: 'rgba(10,13,20,0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0 0 1.5rem 1.5rem',
                transform: isOpen ? 'translateY(0)' : 'translateY(-105%)',
                transition: 'transform 0.38s cubic-bezier(0.34,1.3,0.64,1)',
                paddingTop: '80px', // below navbar
                paddingBottom: '1.5rem',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
            }}>
                {/* Theme toggle for mobile */}
                <div className="flex justify-end px-6 pt-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="bg-white/5 rounded-full" />
                </div>
                {/* Nav links */}
                <nav style={{ padding: '0.5rem 1.5rem 1rem' }}>
                    {NAV_LINKS.map(({ to, label, icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.85rem',
                                padding: '0.9rem 1rem',
                                borderRadius: '0.85rem',
                                color: '#d1d5db',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                transition: 'background 0.2s, color 0.2s',
                                marginBottom: '0.15rem',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db' }}
                        >
                            <span style={{ fontSize: '1.1rem', width: '1.5rem', textAlign: 'center' }}>{icon}</span>
                            {label}
                            <svg style={{ marginLeft: 'auto', opacity: 0.4 }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </nav>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 1.5rem 1rem' }} />

                {/* Subscribe CTA */}
                <div style={{ padding: '0 1.5rem' }}>
                    <button
                        id="mobile-subscribe-btn"
                        onClick={() => { onClose(); onSubscribe() }}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #1d4ed8 100%)',
                            border: 'none', borderRadius: '1rem',
                            color: '#fff', fontFamily: 'Inter, sans-serif',
                            fontWeight: 600, fontSize: '0.95rem',
                            cursor: 'pointer', letterSpacing: '0.01em',
                            boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Subscribe to Newsletter
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

    // Close menu on resize to desktop
    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return (
        <>
            <nav className="sticky top-4 z-[100] mx-4 lg:mx-12 mt-4 glass-panel">
                <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

                    {/* ── Left: Logo ── */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 group shrink-0"
                        aria-label="Flyback Electronics — Home"
                    >
                        <picture>
                            <source srcSet={logoIcon} type="image/webp" />
                            <img
                                src={logoIconFallback}
                                alt="Flyback Electronics logo"
                                width={36}
                                height={36}
                                className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_14px_rgba(59,130,246,0.8)] transition-all duration-300"
                            />
                        </picture>
                        <span className="font-display font-bold text-xl tracking-tight leading-none">
                            <span style={{ color: 'var(--logo-color)' }}>Flyback</span>
                            {' '}
                            <span className="text-primary italic font-normal">Electronics</span>
                        </span>
                    </Link>

                    {/* ── Center: Nav links (desktop only) ── */}
                    <div className="hidden lg:flex items-center gap-x-8 text-sm font-medium">
                        {NAV_LINKS.slice(0, 4).map(({ to, label }) => (
                            <Link key={to} to={to} className="text-current hover:text-primary transition-colors">{label}</Link>
                        ))}
                        <a 
                            href="https://www.fiverr.com/s/your-profile-link" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-white border border-primary/30 hover:bg-primary px-4 py-1.5 rounded-full transition-all duration-300"
                        >
                            Hire Me
                        </a>
                        <button
                            id="navbar-subscribe-btn"
                            onClick={() => setShowSubscribe(true)}
                            className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* ── Right: Icons ── */}
                    <div className="flex items-center gap-x-3">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="hidden lg:block mr-2" />
                        
                        {/* Search */}
                        <Link to="/archive" className="hover:text-primary transition-colors p-1" aria-label="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </Link>

                        {/* Hamburger (mobile only) — animates to X */}
                        <button
                            id="mobile-menu-btn"
                            className="lg:hidden hover:text-primary transition-colors p-1 relative w-6 h-6"
                            aria-label="Menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(o => !o)}
                        >
                            <span style={{
                                position: 'absolute', left: 0, top: '4px', width: '100%', height: '2px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'transform 0.3s ease, opacity 0.3s ease',
                                transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                            }} />
                            <span style={{
                                position: 'absolute', left: 0, top: '10px', width: '100%', height: '2px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'opacity 0.2s ease',
                                opacity: menuOpen ? 0 : 1,
                            }} />
                            <span style={{
                                position: 'absolute', left: 0, top: '16px', width: '100%', height: '2px',
                                borderRadius: '2px', background: 'currentColor',
                                transition: 'transform 0.3s ease, opacity 0.3s ease',
                                transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
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
