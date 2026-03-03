// AdminDashboard — Live articles table fetched from the backend
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

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
        try {
            const data = await api.get('/api/v1/admin/articles')
            setArticles(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchArticles()
    }, [fetchArticles])

    const handleDelete = async (article) => {
        if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return
        setDeletingId(article.id)
        try {
            await api.delete(`/api/v1/admin/articles/${article.id}`)
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
            <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="text-left px-6 py-3 font-medium">Title</th>
                            <th className="text-left px-6 py-3 font-medium">Category</th>
                            <th className="text-left px-6 py-3 font-medium">Status</th>
                            <th className="text-left px-6 py-3 font-medium hidden sm:table-cell">Date</th>
                            <th className="text-right px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : articles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-600 text-sm">
                                    No articles yet.{' '}
                                    <Link to="/admin/articles/new" className="text-blue-400 hover:underline">
                                        Create your first one →
                                    </Link>
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr
                                    key={article.id}
                                    className={`hover:bg-white/5 transition-colors ${deletingId === article.id ? 'opacity-40 pointer-events-none' : ''}`}
                                >
                                    {/* Title */}
                                    <td className="px-6 py-4 text-white font-medium max-w-xs truncate">
                                        {article.title}
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {article.category ?? '—'}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[article.status] ?? STATUS_STYLES.draft}`}>
                                            {article.status}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-gray-500 text-xs hidden sm:table-cell">
                                        {article.publishedAt
                                            ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <Link
                                            to={`/admin/articles/${article.id}/edit`}
                                            className="text-blue-400 hover:text-blue-300 transition-colors mr-5 text-xs font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(article)}
                                            className="text-red-400 hover:text-red-300 transition-colors text-xs font-medium"
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
