// HighlightShare — When user selects text inside an article, show a mini popup to share that quote
// Supports: Twitter/X, LinkedIn, Copy

import { useState, useEffect, useCallback, useRef } from 'react'

const HighlightShare = ({ containerRef }) => {
    const [show, setShow] = useState(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [selectedText, setSelectedText] = useState('')
    const [copied, setCopied] = useState(false)
    const popupRef = useRef(null)

    const handleMouseUp = useCallback(() => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()

        if (!text || text.length < 10 || text.length > 500) {
            setShow(false)
            return
        }

        // Only activate if selection is inside the article container
        if (containerRef?.current && !containerRef.current.contains(selection.anchorNode)) {
            setShow(false)
            return
        }

        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        setSelectedText(text)
        setPos({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 10,
        })
        setShow(true)
        setCopied(false)
    }, [containerRef])

    const handleMouseDown = useCallback((e) => {
        if (popupRef.current?.contains(e.target)) return
        setShow(false)
    }, [])

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [handleMouseUp, handleMouseDown])

    const shareToTwitter = () => {
        const url = window.location.href
        const text = `"${selectedText}" — via @flybackelec`
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            '_blank',
            'width=550,height=420'
        )
    }

    const shareToLinkedIn = () => {
        const url = window.location.href
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'width=550,height=420'
        )
    }

    const copyQuote = async () => {
        try {
            await navigator.clipboard.writeText(`"${selectedText}" — ${window.location.href}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch { /* ignore */ }
    }

    if (!show) return null

    return (
        <div
            ref={popupRef}
            className="fixed z-[300]"
            style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -100%)',
                animation: 'highlight-popup-in 0.15s ease-out',
            }}
        >
            <div
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg"
                style={{
                    background: 'rgba(15,17,21,0.95)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
            >
                {/* Twitter / X */}
                <button
                    onClick={shareToTwitter}
                    className="p-2 rounded-md hover:bg-[#1DA1F2]/20 text-gray-400 hover:text-[#1DA1F2] transition-colors"
                    title="Share on X"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </button>

                {/* LinkedIn */}
                <button
                    onClick={shareToLinkedIn}
                    className="p-2 rounded-md hover:bg-[#0A66C2]/20 text-gray-400 hover:text-[#0A66C2] transition-colors"
                    title="Share on LinkedIn"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764S5.534 3.204 6.5 3.204s1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                    </svg>
                </button>

                {/* Divider */}
                <span className="w-px h-5 bg-white/10 mx-0.5" />

                {/* Copy */}
                <button
                    onClick={copyQuote}
                    className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title={copied ? 'Copied!' : 'Copy quote'}
                >
                    {copied ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Arrow */}
            <div
                className="w-3 h-3 mx-auto -mt-[1px]"
                style={{
                    background: 'rgba(15,17,21,0.95)',
                    transform: 'rotate(45deg)',
                    borderRight: '1px solid rgba(255,255,255,0.15)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                }}
            />

            <style>{`
                @keyframes highlight-popup-in {
                    from { opacity: 0; transform: translate(-50%, -100%) translateY(8px) scale(0.92); }
                    to   { opacity: 1; transform: translate(-50%, -100%) translateY(0) scale(1); }
                }
            `}</style>
        </div>
    )
}

export default HighlightShare
