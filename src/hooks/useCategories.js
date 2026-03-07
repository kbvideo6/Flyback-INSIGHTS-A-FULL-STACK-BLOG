// useCategories — fetches article categories from Supabase `categories` table

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)

        supabase
            .from('categories')
            .select('id, name, slug, color')
            .order('name')
            .then(({ data, error: err }) => {
                if (cancelled) return
                if (err) { setError(err.message); return }
                setCategories(data?.map((c) => c.name) ?? [])
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })

        return () => { cancelled = true }
    }, [])

    return { categories, isLoading, error }
}

export default useCategories
