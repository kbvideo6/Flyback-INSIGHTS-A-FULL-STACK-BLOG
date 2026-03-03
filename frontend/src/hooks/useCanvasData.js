// useCanvasData — fetches /api/v1/graph/canvas
// Returns: { nodes, edges, isLoading, error }
//
// Expected API shape:
// {
//   nodes: [
//     { type: 'hero'|'standard', slug, title, description, position: { placement, top, left, right, bottom, width } },
//     { type: 'trend', variant: 'trends'|'analysis', position: {...} }
//   ],
//   edges: [{ x1, y1, x2, y2 }]
// }
//
// FALLBACK: While the backend isn't ready, this hook falls back to the
// hardcoded configuration so the canvas keeps rendering.

import { useState, useEffect } from 'react'
import api from '../lib/api'

// Hardcoded fallback — mirrors current NodeCanvas.jsx layout
const FALLBACK_CANVAS = {
    nodes: [
        {
            type: 'standard',
            slug: 'new-sensor-tech-for-autonomous-vehicles',
            title: 'New Sensor Tech for Autonomous Vehicles',
            description: 'LiDAR improvements mark a significant step forward for Level 4 autonomy.',
            position: { top: '3%', left: '4%', width: '300px' },
        },
        {
            type: 'standard',
            slug: 'graphene-s-promise-for-flexible-electronics',
            title: "Graphene's Promise for Flexible Electronics",
            description: 'Moving beyond the hype: manufacturing challenges and flexible screens.',
            position: { top: '6%', right: '-2%', width: '280px' },
        },
        {
            type: 'hero',
            slug: 'the-silicon-brain-a-deep-dive-into-ai-accelerators',
            position: { center: true, top: '35%', width: '100%', maxWidth: '48rem' },
        },
        {
            type: 'standard',
            slug: 'emerging-hardware-for-edge-ai',
            title: 'Emerging Hardware for Edge AI',
            description: 'New RISC-V architectures are challenging ARM dominance in IoT.',
            position: { bottom: '28%', left: '2%', width: '320px' },
        },
        {
            type: 'standard',
            slug: 'soft-robotics-in-industrial-automation',
            title: 'Soft Robotics in Industrial Automation',
            description: 'Why factories are turning to silicone-based grippers for delicate tasks.',
            position: { bottom: '15%', right: '34%', width: '300px' },
        },
        {
            type: 'standard',
            slug: 'neuromorphic-chips-brain-inspired-computing',
            title: 'Neuromorphic Chips & Brain-Inspired Computing',
            description: 'How event-driven architectures are reshaping low-power edge inference.',
            position: { bottom: '42%', right: '-2%', width: '290px' },
        },
        {
            type: 'trend',
            variant: 'trends',
            position: { bottom: '4%', left: '15%', width: '260px' },
        },
        {
            type: 'trend',
            variant: 'analysis',
            position: { bottom: '6%', right: '4%', width: '360px' },
        },
    ],
    edges: [
        { x1: '28%', y1: '25%', x2: '42%', y2: '35%' },
        { x1: '72%', y1: '28%', x2: '58%', y2: '35%' },
        { x1: '25%', y1: '70%', x2: '42%', y2: '60%' },
        { x1: '75%', y1: '72%', x2: '58%', y2: '60%' },
        { x1: '40%', y1: '65%', x2: '38%', y2: '78%' },
        { x1: '58%', y1: '65%', x2: '55%', y2: '78%' },
    ],
}

const useCanvasData = () => {
    const [data, setData] = useState(FALLBACK_CANVAS)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setIsLoading(true)
        setError(null)

        api.get('/api/v1/graph/canvas')
            .then((res) => {
                if (!cancelled) setData(res)
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[useCanvasData] API unavailable, using fallback data.', err.message)
                    setError(err.message)
                    // Keep fallback data in place
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [])

    return { ...data, isLoading, error }
}

export default useCanvasData
