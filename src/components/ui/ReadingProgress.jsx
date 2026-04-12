// ReadingProgress — Animated progress bar showing how far user has scrolled through article
// Shows at the very top of the viewport as a sleek gradient line

import { useState, useEffect } from 'react'

const ReadingProgress = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            if (docHeight <= 0) return
            setProgress(Math.min((scrollTop / docHeight) * 100, 100))
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (progress < 1) return null

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[200] h-[3px]"
            style={{ background: 'rgba(15,17,21,0.5)' }}
        >
            <div
                className="h-full transition-[width] duration-100 ease-out"
                style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
                    boxShadow: '0 0 12px rgba(59,130,246,0.6), 0 0 4px rgba(139,92,246,0.4)',
                }}
            />
        </div>
    )
}

export default ReadingProgress
