// AdminLayout — isolated shell for the CMS. No public Navbar or Footer.
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.jsx'

const NAV_LINKS = [
    { to: '/admin/articles', label: '📄 Articles' },
    { to: '/admin/articles/new', label: '✏️ New Article' },
]

import { useState } from 'react'

const AdminLayout = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/admin/login')
    }

    const closeSidebar = () => setIsSidebarOpen(false)

    return (
        <div className="min-h-screen flex bg-background-dark text-gray-100 font-sans relative overflow-hidden transition-colors duration-300">

            {/* ── MOBILE OVERLAY ── */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-background-dark border-r border-glass-border flex flex-col transition-all duration-300 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="px-6 py-5 border-b border-glass-border flex items-center justify-between">
                    <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--logo-color)' }}>
                        Flyback <span className="text-primary font-normal italic">CMS</span>
                    </span>
                    <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-primary transition-colors">
                        ✕
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                    ? 'bg-primary/15 text-primary font-bold shadow-sm'
                                    : 'text-gray-400 hover:bg-primary/5 hover:text-primary'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer: user + sign out */}
                <div className="px-6 py-6 border-t border-glass-border text-xs bg-background-dark/50">
                    <p className="truncate mb-3 text-gray-500 font-medium">{user?.email ?? 'admin'}</p>
                    <button
                        onClick={handleSignOut}
                        className="text-red-500 hover:text-red-400 transition-colors font-bold flex items-center gap-1.5"
                    >
                        Sign out ↩
                    </button>
                </div>
            </aside>

            {/* ── Main content area ── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-background-dark border-b border-glass-border shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-400 hover:text-primary p-2 -ml-2 transition-colors"
                    >
                        ☰
                    </button>
                    <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--logo-color)' }}>
                        Flyback <span className="text-primary italic">CMS</span>
                    </span>
                    <div className="w-8" /> 
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
