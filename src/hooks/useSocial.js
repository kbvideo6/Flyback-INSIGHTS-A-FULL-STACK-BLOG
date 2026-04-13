// useSocial — handles anonymous reactions and comments for articles
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const useSocial = (articleId) => {
    const [comments, setComments] = useState([])
    const [reactions, setReactions] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    // Fetch comments and reactions counts
    const fetchData = useCallback(async () => {
        if (!articleId) return
        setIsLoading(true)

        try {
            // Fetch comments
            const { data: commentsData } = await supabase
                .from('article_comments')
                .select('*')
                .eq('article_id', articleId)
                .order('created_at', { ascending: false })

            if (commentsData) setComments(commentsData)

            // Fetch reactions (grouped counts)
            const { data: reactionsData } = await supabase
                .from('article_reactions')
                .select('reaction_type')
                .eq('article_id', articleId)

            if (reactionsData) {
                const counts = reactionsData.reduce((acc, curr) => {
                    acc[curr.reaction_type] = (acc[curr.reaction_type] || 0) + 1
                    return acc
                }, {})
                setReactions(counts)
            }
        } catch (err) {
            console.error('Social fetch error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [articleId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Add a comment
    const addComment = async (name, content) => {
        if (!articleId || !name || !content) return { error: 'Missing parameters' }

        const { data, error } = await supabase
            .from('article_comments')
            .insert([{ article_id: articleId, author_name: name, content }])
            .select()

        if (error) return { error: error.message }
        setComments(prev => [data[0], ...prev])
        return { success: true }
    }

    // Add a reaction
    const addReaction = async (type) => {
        if (!articleId || !type) return

        const { error } = await supabase
            .from('article_reactions')
            .insert([{ article_id: articleId, reaction_type: type }])

        if (error) {
            console.error('Reaction error:', error)
            return
        }

        setReactions(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + 1
        }))
    }

    return {
        comments,
        reactions,
        isLoading,
        addComment,
        addReaction,
        refresh: fetchData
    }
}

export default useSocial
