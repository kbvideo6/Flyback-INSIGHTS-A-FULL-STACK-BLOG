// useArticle — fetches a single article by slug from /api/v1/articles/:slug
// Falls back to local articles.js data while backend is offline.

import { useState, useEffect } from 'react'
import api from '../lib/api'
import { getArticleBySlug } from '../constants/articles'

const useArticle = (slug) => {
    const [article, setArticle] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!slug) {
            setIsLoading(false)
            return
        }

        let cancelled = false
        setIsLoading(true)
        setError(null)

        api.get(`/api/v1/articles/${slug}`)
            .then((res) => {
                if (!cancelled) setArticle(res)
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[useArticle] API unavailable, using local data.', err.message)
                    // Fallback to local static data
                    const local = getArticleBySlug(slug)
                    setArticle(local ?? null)
                    if (!local) setError('Article not found.')
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [slug])

    return { article, isLoading, error }
}

export default useArticle
