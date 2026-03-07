import NodeCanvas from '../components/canvas/NodeCanvas'
import usePageTitle from '../hooks/usePageTitle'

// Home Page — the spatial "atlas" layout
const Home = () => {
    usePageTitle(null) // shows just "Flyback Electronics"
    return <NodeCanvas />
}

export default Home
