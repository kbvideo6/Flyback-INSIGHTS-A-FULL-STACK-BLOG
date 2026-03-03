// AdminDashboard — Articles list view (placeholder)
import { Link } from 'react-router-dom'

// TODO: Replace with real data fetched from Supabase
const MOCK_ARTICLES = [
    { id: 1, title: 'The Silicon Brain: A Deep Dive into AI Accelerators', slug: 'the-silicon-brain-a-deep-dive-into-ai-accelerators', status: 'published' },
    { id: 2, title: 'Draft: Photonic Chips and the Future of Compute', slug: 'photonic-chips-future-of-compute', status: 'draft' },
]

const STATUS_STYLES = {
    published: 'bg-green-500/10 text-green-400 border-green-500/30',
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
}

const AdminDashboard = () => {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Articles</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your published and draft articles</p>
                </div>
                <Link
                    to="/admin/articles/new"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                    + New Article
                </Link>
            </div>

            {/* Articles table */}
            <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="text-left px-6 py-3 font-medium">Title</th>
                            <th className="text-left px-6 py-3 font-medium">Status</th>
                            <th className="text-right px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_ARTICLES.map((article) => (
                            <tr key={article.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{article.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[article.status]}`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/admin/articles/${article.id}/edit`}
                                        className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button className="text-red-400 hover:text-red-300 transition-colors">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminDashboard
