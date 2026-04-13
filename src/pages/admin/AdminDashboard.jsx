// AdminDashboard — Live articles table fetched from the backend
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// ── Status badge styles ───────────────────────────────────────────────────
const STATUS_STYLES = {
    published: 'bg-green-500/10 text-green-400 border-green-500/30',
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
}

// ── Skeleton row ─────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr className="border-b border-white/5">
        <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded animate-pulse w-3/4" /></td>
        <td className="px-6 py-4"><div className="h-5 bg-white/5 rounded-full animate-pulse w-16" /></td>
        <td className="px-6 py-4"><div className="h-4 bg-white/5 rounded animate-pulse w-24 ml-auto" /></td>
    </tr>
)

// ── Main component ────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const fetchArticles = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        const { data, error: err } = await supabase
            .from('articles')
            .select('id, title, slug, is_published, published_at, categories(name)')
            .order('created_at', { ascending: false })
        setIsLoading(false)
        if (err) { setError(err.message); return }
        setArticles(data ?? [])
    }, [])

    useEffect(() => {
        fetchArticles()
    }, [fetchArticles])

    const handleDelete = async (article) => {
        if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return
        setDeletingId(article.id)
        try {
            const { error: err } = await supabase.from('articles').delete().eq('id', article.id)
            if (err) throw new Error(err.message)
            // Optimistic removal
            setArticles((prev) => prev.filter((a) => a.id !== article.id))
        } catch (err) {
            alert(`Delete failed: ${err.message}`)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Articles</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isLoading ? 'Loading…' : `${articles.length} article${articles.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link
                    to="/admin/articles/new"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span className="text-lg leading-none">+</span> New Article
                </Link>
            </div>

            {/* ── Error banner ── */}
            {error && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
                    <span>Failed to load articles: {error}</span>
                    <button onClick={fetchArticles} className="text-red-300 hover:text-red-200 underline text-xs">
                        Retry
                    </button>
                </div>
            )}

            {/* ── Table ── */}
            <div className="glass-panel overflow-hidden border-glass-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-glass-border text-gray-500 text-xs uppercase tracking-widest bg-gray-500/5">
                            <th className="text-left px-6 py-4 font-bold">Title</th>
                            <th className="text-left px-6 py-4 font-bold">Category</th>
                            <th className="text-left px-6 py-4 font-bold">Status</th>
                            <th className="text-left px-6 py-4 font-bold hidden sm:table-cell">Date</th>
                            <th className="text-right px-6 py-4 font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border/50">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : articles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm italic italic">
                                    No articles established yet.{' '}
                                    <Link to="/admin/articles/new" className="text-primary hover:underline font-bold">
                                        Initialize your first node →
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr
                                    key={article.id}
                                    className={`hover:bg-primary/5 transition-all ${deletingId === article.id ? 'opacity-40 pointer-events-none' : ''}`}
                                >
                                    {/* Title */}
                                    <td className="px-6 py-4 text-white font-bold max-w-xs truncate">
                                        {article.title}
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 text-gray-400 text-xs font-medium uppercase tracking-tight">
                                        {article.categories?.name ?? 'General'}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const status = article.is_published ? 'published' : 'draft'
                                            return (
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
                                                    {status}
                                                </span>
                                            )
                                        })()}
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-gray-500 text-xs font-mono hidden sm:table-cell">
                                        {article.published_at
                                            ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : 'PENDING'
                                        }
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <Link
                                            to={`/admin/articles/${article.id}/edit`}
                                            className="text-primary hover:text-blue-600 transition-colors mr-6 text-xs font-black uppercase tracking-widest"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(article)}
                                            className="text-red-500 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-widest"
                                        >
                                            {deletingId === article.id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboard
