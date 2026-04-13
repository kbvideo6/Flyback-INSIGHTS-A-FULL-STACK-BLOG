// useArticles — fetches all published articles from Supabase `articles` table
// Accepts an optional category slug to filter by joining categories.
//
// Usage:
//   const { articles, isLoading, error } = useArticles()
//   const { articles, isLoading, error } = useArticles('deep-dive')

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useArticles = (categorySlug = null) => {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        const run = async () => {
            let query = supabase
                .from('articles')
                .select('id, title, slug, excerpt, author, read_time, image_url, cover_image_url, is_featured, published_at, views, categories(id, name, slug, color)')
                .eq('is_published', true)
                .order('published_at', { ascending: false })

            if (categorySlug) {
                const { data: cat } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', categorySlug)
                    .single()
                if (cat) query = query.eq('category_id', cat.id)
            }

            const { data, error: err } = await query
            if (cancelled) return
            if (err) { setError(err.message); return }
            setArticles(data ?? [])
        }

        run().finally(() => { if (!cancelled) setIsLoading(false) })

        // Real-time subscription
        const channel = supabase
            .channel('public:articles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
                run() // Refetch logic on change
            })
            .subscribe()

        return () => {
            cancelled = true
            supabase.removeChannel(channel)
        }
    }, [categorySlug])

    return { articles, isLoading, error }
}

export default useArticles
