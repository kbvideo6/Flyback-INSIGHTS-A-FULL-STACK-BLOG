// useTrends — fetches active trends from Supabase `trends` table

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const FALLBACK_TRENDS = [
    { id: 1, label: 'Quantum Sensors', meta: 'High Frequency Interaction' },
    { id: 2, label: 'Bio-inspired Electronics', meta: 'Emerging Sub-field' },
]

const useTrends = () => {
    const [trends, setTrends] = useState(FALLBACK_TRENDS)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)

        supabase
            .from('trends')
            .select('id, title, slug, summary, score, categories(name)')
            .eq('is_active', true)
            .order('score', { ascending: false })
            .limit(6)
            .then(({ data, error: err }) => {
                if (cancelled) return
                if (err || !data?.length) { setError(err?.message ?? null); return }
                setTrends(data.map((t) => ({
                    id: t.id,
                    label: t.title,
                    meta: t.categories?.name ?? t.summary ?? '',
                    slug: t.slug,
                    score: t.score,
                })))
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })

        return () => { cancelled = true }
    }, [])

    return { trends, isLoading, error }
}

export default useTrends
