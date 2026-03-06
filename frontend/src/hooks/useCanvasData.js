// useCanvasData — builds the canvas node layout from Supabase articles.
// Returns: { nodes, edges, isLoading, error }
//
// Layout:
//   hero   — most recently published article (centre)
//   standard — next 6 published articles arranged around it
//   trend  — two TrendNode cards (trends list + analysis chart)

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Desktop positions for the 6 standard nodes around the hero
const STANDARD_POSITIONS = [
    { top: '3%', left: '4%', width: '300px' },
    { top: '6%', right: '1%', width: '280px' },
    { bottom: '28%', left: '38%', width: '300px' },   // moved to open center-bottom
    { bottom: '5%', right: '34%', width: '300px' },
    { bottom: '42%', right: '1%', width: '290px' },
    { top: '38%', left: '2%', width: '270px' },
]

const EDGES = [
    { x1: '28%', y1: '25%', x2: '42%', y2: '35%' },
    { x1: '72%', y1: '28%', x2: '58%', y2: '35%' },
    { x1: '25%', y1: '70%', x2: '42%', y2: '60%' },
    { x1: '75%', y1: '72%', x2: '58%', y2: '60%' },
    { x1: '40%', y1: '65%', x2: '38%', y2: '78%' },
    { x1: '58%', y1: '65%', x2: '55%', y2: '78%' },
]

const useCanvasData = () => {
    const [nodes, setNodes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        supabase
            .from('articles')
            .select('id, title, slug, excerpt, cover_image_url, image_url, author, read_time, published_at')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(7)
            .then(({ data, error: err }) => {
                if (cancelled) return
                if (err) { setError(err.message); return }
                if (!data?.length) return

                const [hero, ...rest] = data

                const built = [
                    {
                        type: 'hero',
                        slug: hero.slug,
                        title: hero.title,
                        excerpt: hero.excerpt,
                        coverImageUrl: hero.cover_image_url ?? hero.image_url,
                        author: hero.author,
                        readTime: hero.read_time,
                        position: { center: true, top: '35%', width: '100%', maxWidth: '48rem' },
                    },
                    ...rest.slice(0, 6).map((article, i) => ({
                        type: 'standard',
                        slug: article.slug,
                        title: article.title,
                        description: article.excerpt,
                        coverImageUrl: article.cover_image_url ?? article.image_url,
                        position: STANDARD_POSITIONS[i],
                    })),
                    {
                        type: 'trend',
                        variant: 'trends',
                        position: { bottom: '4%', left: '2%', width: '260px' },
                    },
                    {
                        type: 'trend',
                        variant: 'analysis',
                        position: { bottom: '6%', right: '1%', width: '320px' },
                    },
                ]

                setNodes(built)
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })

        return () => { cancelled = true }
    }, [])

    return { nodes, edges: EDGES, isLoading, error }
}

export default useCanvasData
