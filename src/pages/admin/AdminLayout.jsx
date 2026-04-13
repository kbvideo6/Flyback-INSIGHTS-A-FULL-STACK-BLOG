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
        <div className="min-h-screen flex bg-gray-950 text-gray-100 font-sans relative overflow-hidden">

            {/* ── MOBILE OVERLAY ── */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/10 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <span className="font-bold text-lg tracking-tight text-white">
                        Flyback <span className="text-blue-400 font-normal italic">CMS</span>
                    </span>
                    <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
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
                                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 font-medium'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer: user + sign out */}
                <div className="px-6 py-6 border-t border-white/10 text-xs text-gray-500 bg-gray-900/50">
                    <p className="truncate mb-3 text-gray-400">{user?.email ?? 'admin'}</p>
                    <button
                        onClick={handleSignOut}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium flex items-center gap-1.5"
                    >
                        Sign out ↩
                    </button>
                </div>
            </aside>

            {/* ── Main content area ── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-white/10 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-400 hover:text-white p-2 -ml-2"
                    >
                        ☰
                    </button>
                    <span className="font-bold text-sm tracking-tight text-white">
                        Flyback <span className="text-blue-400 italic">CMS</span>
                    </span>
                    <div className="w-8" /> {/* Balance */}
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
