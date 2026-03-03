// ArticleEditor — Rich-text editor page for creating / editing articles
// Uses Tiptap with starter-kit + image extension
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ── Toolbar button helper ──────────────────────────────────────────────────
const ToolbarBtn = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`px-2.5 py-1 rounded text-sm transition-colors ${active
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
    >
        {children}
    </button>
)

// ── Main component ─────────────────────────────────────────────────────────
const ArticleEditor = () => {
    const { id } = useParams()          // undefined = new article
    const navigate = useNavigate()
    const isNew = !id

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [category, setCategory] = useState('')
    const [status, setStatus] = useState('draft')
    const [saving, setSaving] = useState(false)

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const value = e.target.value
        setTitle(value)
        if (isNew) {
            setSlug(
                value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
            )
        }
    }

    // Tiptap editor
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '<p>Start writing your article here…</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[24rem] px-6 py-5 focus:outline-none text-gray-200',
            },
        },
    })

    // TODO: Replace with actual Supabase upsert
    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        console.log('Saving article:', {
            id,
            title,
            slug,
            category,
            status,
            body: editor?.getHTML(),
        })
        // Simulated delay
        await new Promise((r) => setTimeout(r, 800))
        setSaving(false)
        navigate('/admin/articles')
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page heading */}
            <h1 className="text-2xl font-bold text-white mb-6">
                {isNew ? 'New Article' : `Edit Article #${id}`}
            </h1>

            <form onSubmit={handleSave} className="space-y-6">
                {/* ── Metadata fields ── */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6 space-y-4">
                    <div>
                        <label htmlFor="article-title" className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                        <input
                            id="article-title"
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Article title"
                            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="article-slug" className="block text-xs font-medium text-gray-400 mb-1">Slug</label>
                            <input
                                id="article-slug"
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="auto-generated-from-title"
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="article-category" className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                            <select
                                id="article-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="">Select category…</option>
                                <option value="deep-dive">Deep Dive</option>
                                <option value="analysis">Analysis</option>
                                <option value="trend">Trend</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Rich text editor ── */}
                <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    {editor && (
                        <div className="flex flex-wrap gap-1 px-4 py-3 border-b border-white/10 bg-gray-800/50">
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">B</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">1. List</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">" "</ToolbarBtn>
                            <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{`</>`}</ToolbarBtn>
                        </div>
                    )}
                    <EditorContent editor={editor} />
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center justify-between">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                        >
                            {saving ? 'Saving…' : 'Save Article'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ArticleEditor
