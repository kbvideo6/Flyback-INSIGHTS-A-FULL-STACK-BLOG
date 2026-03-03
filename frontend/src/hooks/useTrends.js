// useTrends — fetches trending topics from /api/v1/trends
// Falls back to a static list while the API is offline.

import { useState, useEffect } from 'react'
import api from '../lib/api'

const FALLBACK_TRENDS = [
    { id: 1, label: 'Quantum Sensors', meta: 'High Frequency Interaction' },
    { id: 2, label: 'Bio-inspired Electronics', meta: 'Emerging Sub-field' },
    { id: 3, label: 'Solid-State LiDAR', meta: 'Accelerating Adoption' },
    { id: 4, label: 'Chiplet Architectures', meta: 'Supply Chain Shift' },
]

const useTrends = () => {
    const [trends, setTrends] = useState(FALLBACK_TRENDS)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        api.get('/api/v1/trends')
            .then((res) => {
                if (!cancelled) setTrends(res)
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[useTrends] API unavailable, using fallback data.', err.message)
                    setError(err.message)
                    // Keep fallback trends in state
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [])

    return { trends, isLoading, error }
}

export default useTrends
