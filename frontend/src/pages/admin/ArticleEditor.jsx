// ArticleEditor — Full rich-text editor for creating & editing articles
// Tiptap: @tiptap/react + starter-kit + extension-image
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/slugify'

// ── Toolbar button ────────────────────────────────────────────────────────
const Btn = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
    >
        {children}
    </button>
)

const DIVIDER = <span className="w-px h-5 bg-white/10 mx-1 self-center" />

const CATEGORIES = ['Deep Dive', 'Analysis', 'Sensors', 'Edge Computing', 'Materials', 'Robotics']

// ── Main component ────────────────────────────────────────────────────────
const ArticleEditor = () => {
    const { id } = useParams()         // undefined → new article
    const navigate = useNavigate()
    const isNew = !id

    // ── Form state ───────────────────────────────────────────────────────
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [category, setCategory] = useState('')
    const [readTime, setReadTime] = useState('')
    const [status, setStatus] = useState('draft')
    const [coverUrl, setCoverUrl] = useState(null)   // URL returned by upload
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)

    // ── Cover image drag-and-drop state ──────────────────────────────────
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)
    const coverInputRef = useRef(null)

    // ── Tiptap editor ────────────────────────────────────────────────────
    const editor = useEditor({
        extensions: [StarterKit, Image.configure({ inline: false, allowBase64: false })],
        content: '<p>Start writing your article here…</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[26rem] px-6 py-5 focus:outline-none text-gray-200 leading-relaxed',
            },
        },
    })

    // ── Load existing article when editing ───────────────────────────────
    useEffect(() => {
        if (!isNew && editor) {
            api.get(`/api/v1/admin/articles/${id}`)
                .then((article) => {
                    setTitle(article.title ?? '')
                    setSlug(article.slug ?? '')
                    setExcerpt(article.excerpt ?? '')
                    setCategory(article.category ?? '')
                    setReadTime(article.readTime ?? '')
                    setStatus(article.status ?? 'draft')
                    setCoverUrl(article.coverUrl ?? null)
                    if (article.body) editor.commands.setContent(article.body)
                })
                .catch((err) => setSaveError(`Could not load article: ${err.message}`))
        }
    }, [id, isNew, editor])

    // ── Auto-generate slug from title (new articles only) ────────────────
    const handleTitleChange = (e) => {
        const value = e.target.value
        setTitle(value)
        if (isNew) setSlug(slugify(value))
    }

    // ── Cover image upload ────────────────────────────────────────────────
    const uploadCoverImage = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setUploadError('Please drop an image file.')
            return
        }
        setIsUploading(true)
        setUploadError(null)
        try {
            const formData = new FormData()
            // Field name must match multer's upload.single('image') in adminRoutes
            formData.append('image', file)
            // POST multipart/form-data — don't go through api.js (no JSON body)
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch(
                `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/v1/admin/upload`,
                {
                    method: 'POST',
                    body: formData,
                    headers: session?.access_token
                        ? { Authorization: `Bearer ${session.access_token}` }
                        : {},
                }
            )
            if (!res.ok) throw new Error(await res.text())
            const { url } = await res.json()
            setCoverUrl(url)
        } catch (err) {
            setUploadError(err.message ?? 'Upload failed.')
        } finally {
            setIsUploading(false)
        }
    }, [])

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) uploadCoverImage(file)
    }

    // ── Save (draft or published) ─────────────────────────────────────────
    const handleSave = async (overrideStatus) => {
        if (!title.trim()) { setSaveError('Title is required.'); return }
        if (!slug.trim()) { setSaveError('Slug is required.'); return }

        setSaving(true)
        setSaveError(null)

        const payload = {
            title,
            slug,
            excerpt,
            category,
            readTime,
            coverUrl,
            status: overrideStatus ?? status,
            body: editor?.getHTML() ?? '',
            bodyJson: editor?.getJSON() ?? {},
        }

        try {
            if (isNew) {
                await api.post('/api/v1/admin/articles', payload)
            } else {
                await api.put(`/api/v1/admin/articles/${id}`, payload)
            }
            navigate('/admin/articles')
        } catch (err) {
            setSaveError(err.message ?? 'Save failed. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    // ── Field style helper ────────────────────────────────────────────────
    const fieldCls = 'w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors'

    return (
        <div className="max-w-4xl mx-auto pb-16">
            {/* Page heading */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {isNew ? 'New Article' : 'Edit Article'}
                </h1>
                <button
                    type="button"
                    onClick={() => navigate('/admin/articles')}
                    className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                    ← Back
                </button>
            </div>

            {/* Save error */}
            {saveError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {saveError}
                </div>
            )}

            <div className="space-y-6">
                {/* ── Cover image drag-and-drop ── */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => coverInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                        ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-gray-900/50'}
                        ${coverUrl ? 'aspect-[21/9]' : 'h-28 flex items-center justify-center'}`}
                >
                    {coverUrl ? (
                        <>
                            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Click or drop to replace</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-600 text-sm">
                            {isUploading
                                ? <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block" />
                                    Uploading…
                                </span>
                                : <>
                                    <span className="block text-2xl mb-1">🖼</span>
                                    Drag & drop a cover image, or <span className="text-blue-400">click to browse</span>
                                </>
                            }
                        </div>
                    )}
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCoverImage(f) }}
                    />
                </div>
                {uploadError && <p className="text-red-400 text-xs -mt-4">{uploadError}</p>}

                {/* ── Metadata ── */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="article-title" className="block text-xs font-medium text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
                        <input id="article-title" type="text" required value={title} onChange={handleTitleChange} placeholder="Article title" className={fieldCls} />
                    </div>

                    {/* Slug + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="article-slug" className="block text-xs font-medium text-gray-400 mb-1">Slug <span className="text-red-400">*</span></label>
                            <input id="article-slug" type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" className={`${fieldCls} font-mono`} />
                        </div>
                        <div>
                            <label htmlFor="article-category" className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                            <select id="article-category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldCls}>
                                <option value="">Select category…</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Excerpt + Read time */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label htmlFor="article-excerpt" className="block text-xs font-medium text-gray-400 mb-1">Excerpt</label>
                            <textarea id="article-excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown in article cards…" className={`${fieldCls} resize-none`} />
                        </div>
                        <div>
                            <label htmlFor="article-readtime" className="block text-xs font-medium text-gray-400 mb-1">Read time</label>
                            <input id="article-readtime" type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="8 min read" className={fieldCls} />
                        </div>
                    </div>
                </div>

                {/* ── Rich text editor ── */}
                <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">
                    {/* Toolbar */}
                    {editor && (
                        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2.5 border-b border-white/10 bg-gray-800/60">
                            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><strong>B</strong></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</Btn>
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</Btn>
                            <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">1. List</Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">" "</Btn>
                            <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{`</>`}</Btn>
                            <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</Btn>
                            {DIVIDER}
                            {/* Insert image from URL */}
                            <Btn
                                title="Insert image URL"
                                onClick={() => {
                                    const url = window.prompt('Image URL:')
                                    if (url) editor.chain().focus().setImage({ src: url }).run()
                                }}
                            >
                                🖼
                            </Btn>
                        </div>
                    )}
                    <EditorContent editor={editor} />
                </div>

                {/* ── Action bar ── */}
                <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-600">
                        {editor ? `${editor.storage.characterCount?.characters?.() ?? '—'} characters` : ''}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            disabled={saving}
                            className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="px-5 py-2 rounded-lg text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-40"
                        >
                            {saving && status === 'draft' ? 'Saving…' : 'Save Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                        >
                            {saving && status === 'published' ? 'Publishing…' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleEditor

