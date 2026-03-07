// useTopicTree — fetches the full 2-level category tree (topics + subtopics)
// Returns:
//   topicTree: [{ id, name, slug, color, description, subtopics: [...] }]
//   allSubtopics: flat list of all subtopic categories

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useTopicTree = () => {
    const [topicTree, setTopicTree] = useState([])
    const [allSubtopics, setAllSubtopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)

        supabase
            .from('categories')
            .select('id, name, slug, color, icon, description, parent_id')
            .order('name')
            .then(({ data, error: err }) => {
                if (cancelled) return
                if (err) { setError(err.message); return }

                const all = data ?? []

                // If parent_id column doesn't exist yet, fall back to flat list
                const hasParentId = all.length > 0 && 'parent_id' in all[0]

                if (!hasParentId) {
                    // Flat fallback — treat everything as a top-level topic
                    setTopicTree(all.map(c => ({ ...c, subtopics: [] })))
                    setAllSubtopics(all)
                    return
                }

                const parents = all.filter(c => !c.parent_id)
                const children = all.filter(c => c.parent_id)

                const tree = parents.map(parent => ({
                    ...parent,
                    subtopics: children.filter(c => c.parent_id === parent.id),
                }))

                setTopicTree(tree)
                setAllSubtopics(children)
            })
            .finally(() => { if (!cancelled) setIsLoading(false) })

        return () => { cancelled = true }
    }, [])

    return { topicTree, allSubtopics, isLoading, error }
}

export default useTopicTree
