// AdminLayout — isolated shell for the CMS. No public Navbar or Footer.
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const NAV_LINKS = [
    { to: '/admin/articles', label: '📄 Articles' },
    { to: '/admin/articles/new', label: '✏️ New Article' },
]

const AdminLayout = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen flex bg-gray-950 text-gray-100 font-sans">

            {/* ── Sidebar ── */}
            <aside className="w-60 shrink-0 bg-gray-900 border-r border-white/10 flex flex-col">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-white/10">
                    <span className="font-bold text-lg tracking-tight text-white">
                        Flyback <span className="text-blue-400 font-normal italic">CMS</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_LINKS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-blue-600/20 text-blue-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer: user + sign out */}
                <div className="px-4 py-4 border-t border-white/10 text-xs text-gray-500">
                    <p className="truncate mb-2">{user?.email ?? 'admin'}</p>
                    <button
                        onClick={handleSignOut}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </aside>

            {/* ── Main content area ── */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
