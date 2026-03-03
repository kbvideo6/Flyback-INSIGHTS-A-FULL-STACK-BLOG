// AdminLogin — email/password login page for the CMS
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const AdminLogin = () => {
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/admin/articles')
        } catch (err) {
            setError(err.message ?? 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">

                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="font-bold text-2xl text-white tracking-tight">
                        Flyback <span className="text-blue-400 font-normal italic">CMS</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to manage content</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="admin-email" className="block text-xs font-medium text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="you@flyback.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" className="block text-xs font-medium text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
