// Main Layout — wraps all pages with Navbar + Footer
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import NewsletterSync from './NewsletterSync'
import Footer from './Footer'

const Layout = () => {
    return (
        // Flex-col stacks children vertically. min-h-screen ensures full viewport height.
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans overflow-hidden">
            <Navbar />

            {/* The relative wrapper is the coordinate system origin (0,0) for the nodes. */}
            <main className="relative flex-grow w-full max-w-[1400px] mx-auto min-h-[1200px] py-10">
                <Outlet />
            </main>

            <NewsletterSync />
            <Footer />
        </div>
    )
}

export default Layout
