// ScrollToTop — Floating button that appears when user scrolls down, smoothly scrolls back up

import { useState, useEffect } from 'react'

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <button
            onClick={scrollUp}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-[150] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group"
            style={{
                background: 'rgba(59,130,246,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(59,130,246,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <svg
                className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    )
}

export default ScrollToTop
