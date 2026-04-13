import NodeCanvas from '../components/canvas/NodeCanvas'
import useSEO from '../hooks/useSEO'

// Home Page — the spatial "atlas" layout
const Home = () => {
    useSEO({
        title: 'Semiconductor Intelligence & AI Hardware Atlas',
        description: 'Professional engineering insights on GaN/SiC power electronics, AI chip architectures, neuromorphic computing, and high-speed PCB design. Your technical atlas for the future of hardware.',
    })
    return <NodeCanvas />
}

export default Home
