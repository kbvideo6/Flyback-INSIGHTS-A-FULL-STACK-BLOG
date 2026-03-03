// useCategories — fetches article categories from /api/v1/categories
// Falls back to the derived category list from local articles.js.

import { useState, useEffect } from 'react'
import api from '../lib/api'
import { categories as localCategories } from '../constants/articles'

const useCategories = () => {
    const [categories, setCategories] = useState(localCategories)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        api.get('/api/v1/categories')
            .then((res) => {
                if (!cancelled) setCategories(res)
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[useCategories] API unavailable, using local data.', err.message)
                    setError(err.message)
                    // Keep localCategories in state (already initialised above)
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [])

    return { categories, isLoading, error }
}

export default useCategories
