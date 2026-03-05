// useArticle — fetches a single published article by slug from Supabase

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useArticle = (slug) => {
    const [article, setArticle] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) { setIsLoading(false); return }

        let cancelled = false
        setIsLoading(true)
        setError(null)

        supabase
            .from('articles')
            .select('*, categories(id, name, slug, color)')
            .eq('slug', slug)
            .eq('is_published', true)
            .single()
            .then(({ data, error: err }) => {
                if (cancelled) return
                if (err) { setError(err.code === 'PGRST116' ? 'Article not found.' : err.message); return }
                setArticle(data)
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })

        return () => { cancelled = true }
    }, [slug])

    return { article, isLoading, error }
}

export default useArticle
