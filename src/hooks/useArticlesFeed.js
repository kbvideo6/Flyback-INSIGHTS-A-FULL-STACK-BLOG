// useArticlesFeed — paginated article fetching for the mobile feed.
// Fetches in batches of PAGE_SIZE, with an Intersection-Observer-driven
// "load more" pattern (infinite scroll).  Skips article slugs already
// shown in the carousel so there is zero duplication.
//
// Usage:
//   const { articles, isLoading, hasMore, loadMore } = useArticlesFeed(excludeSlugs, PAGE_SIZE)

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const useArticlesFeed = (excludeSlugs = [], pageSize = 8) => {
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(0)          // 0-based page index
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const excludeSet = useRef(new Set(excludeSlugs))

    // Keep excludeSet in sync without triggering a re-fetch
    useEffect(() => { excludeSet.current = new Set(excludeSlugs) }, [excludeSlugs])

    const fetchPage = useCallback(async (pageIndex) => {
        setIsLoading(true)
        const from = pageIndex * pageSize
        const to = from + pageSize - 1   // Supabase range is inclusive

        const { data, error } = await supabase
            .from('articles')
            .select('id, title, slug, read_time, cover_image_url, image_url, categories(name)')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .range(from, to + excludeSet.current.size + 5)  // fetch a few extra to cover skips

        if (error || !data) { setIsLoading(false); setHasMore(false); return }

        // Filter out articles already in the carousel
        const fresh = data.filter(a => !excludeSet.current.has(a.slug))

        // Trim to exactly pageSize
        const trimmed = fresh.slice(0, pageSize)

        setArticles(prev => {
            // Deduplicate by id in case of overlap
            const seen = new Set(prev.map(a => a.id))
            return [...prev, ...trimmed.filter(a => !seen.has(a.id))]
        })
        setHasMore(trimmed.length >= pageSize)
        setIsLoading(false)
    }, [pageSize])

    // Load first page on mount / whenever excludeSlugs stabilises
    useEffect(() => {
        setArticles([])
        setPage(0)
        setHasMore(true)
        fetchPage(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])   // intentionally run once; excludeSlugs is accessed via ref

    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return
        const next = page + 1
        setPage(next)
        fetchPage(next)
    }, [isLoading, hasMore, page, fetchPage])

    return { articles, isLoading, hasMore, loadMore }
}

export default useArticlesFeed
