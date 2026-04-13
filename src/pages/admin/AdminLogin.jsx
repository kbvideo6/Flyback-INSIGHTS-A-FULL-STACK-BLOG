import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/admin/articles')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-dark p-4 transition-colors duration-300">
            <div className="w-full max-w-md glass-panel p-10 border-glass-border shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--logo-color)' }}>
                        Flyback <span className="text-primary italic font-normal">CMS</span>
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Administrative Portal</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs font-bold text-red-500 text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="admin-email" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary">
                            Credentials / Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="engineer@flyback.com"
                            className="w-full rounded-xl border border-glass-border bg-background-dark/50 p-3.5 text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:opacity-30"
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary">
                            Access Key / Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-glass-border bg-background-dark/50 p-3.5 text-white outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:opacity-30"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-primary p-4 font-black text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-600 hover:scale-[1.02] shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Authorizing…' : 'Initialize Session'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-[10px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-widest">
                        ← Exit to Public Atlas
                    </a>
                </div>
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.3s ease-in-out; }
            `}</style>
        </div>
    )
}

