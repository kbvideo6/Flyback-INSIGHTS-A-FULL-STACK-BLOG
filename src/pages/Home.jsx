import NodeCanvas from '../components/canvas/NodeCanvas'
import useSEO from '../hooks/useSEO'

// Home Page — the spatial "atlas" layout
const Home = () => {
    useSEO({
        description: 'In-depth electronics insights, deep dives, analysis and emerging trends in semiconductors, AI, and robotics.',
    })
    return <NodeCanvas />
}

export default Home
