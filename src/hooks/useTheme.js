import { useState, useEffect } from 'react'

const useTheme = () => {
    // Initial theme check: localStorage -> system preference -> default 'dark'
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem('flyback-theme')
            if (stored) return stored
            
            const userMedia = window.matchMedia('(prefers-color-scheme: light)')
            if (userMedia.matches) return 'light'
        }
        return 'dark'
    }

    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        const root = window.document.documentElement
        root.setAttribute('data-theme', theme)
        localStorage.setItem('flyback-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}

export default useTheme
