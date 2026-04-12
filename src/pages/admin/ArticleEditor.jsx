// ArticleEditor — Full rich-text editor for creating & editing articles
// Tiptap: @tiptap/react + starter-kit + extension-image
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

// ── Main component ────────────────────────────────────────────────────────
const ArticleEditor = () => {
    const { id } = useParams()         // undefined → new article
    const navigate = useNavigate()
    const isNew = !id

    // ── Form state ───────────────────────────────────────────────────────
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [categoryId, setCategoryId] = useState('')  // DB category ID
    const [dbCategories, setDbCategories] = useState([])
    const [readTime, setReadTime] = useState('')
    const [coverUrl, setCoverUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)

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

    // ── Load categories for the dropdown ───────────────────────────
    useEffect(() => {
        supabase
            .from('categories')
            .select('id, name')
            .order('name')
            .then(({ data }) => { if (data?.length) setDbCategories(data) })
    }, [])

    // ── Load existing article when editing ───────────────────────────────
    useEffect(() => {
        if (!isNew && editor) {
            supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single()
                .then(({ data, error: err }) => {
                    if (err) { setSaveError(`Could not load article: ${err.message}`); return }
                    setTitle(data.title ?? '')
                    setSlug(data.slug ?? '')
                    setExcerpt(data.excerpt ?? '')
                    setCategoryId(String(data.category_id ?? ''))
                    setReadTime(String(data.read_time ?? ''))
                    setCoverUrl(data.cover_image_url ?? '')
                    if (data.content) editor.commands.setContent(data.content)
                })
        }
    }, [id, isNew, editor])

    // ── Auto-generate slug from title (new articles only) ────────────────
    const handleTitleChange = (e) => {
        const value = e.target.value
        setTitle(value)
        if (isNew) setSlug(slugify(value))
    }

    // ── Upload cover image to Supabase Storage ───────────────────────────
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState(null)

    const handleFileUpload = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            setUploadError('Please select an image file.')
            return
        }
        setIsUploading(true)
        setUploadError(null)
        try {
            const ext = file.name.split('.').pop()
            const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
            const { error: uploadErr } = await supabase.storage
                .from('article-images')
                .upload(path, file, { contentType: file.type, upsert: false })
            if (uploadErr) throw new Error(uploadErr.message)
            const { data } = supabase.storage.from('article-images').getPublicUrl(path)
            setCoverUrl(data.publicUrl)
        } catch (err) {
            setUploadError(err.message ?? 'Upload failed.')
        } finally {
            setIsUploading(false)
        }
    }, [])

    // ── Save (draft or published) ─────────────────────────────────────────
    const handleSave = async (publish = false) => {
        if (!title.trim()) { setSaveError('Title is required.'); return }
        if (!slug.trim()) { setSaveError('Slug is required.'); return }
        if (!categoryId) { setSaveError('Category is required.'); return }

        setSaving(true)
        setSaveError(null)

        const payload = {
            title,
            slug,
            excerpt,
            content: editor?.getHTML() ?? '',
            category_id: parseInt(categoryId, 10),
            read_time: readTime ? parseInt(readTime, 10) : null,
            cover_image_url: coverUrl || null,
            is_published: publish,
        }

        try {
            const { error: err } = isNew
                ? await supabase.from('articles').insert([payload])
                : await supabase.from('articles').update(payload).eq('id', id)
            if (err) throw new Error(err.message)
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
                {/* ── Cover image ── */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image</label>
                    <div className="flex flex-col gap-2">
                        <input
                            id="article-cover-url"
                            type="url"
                            value={coverUrl}
                            onChange={(e) => { setCoverUrl(e.target.value); setUploadError(null) }}
                            placeholder="Paste image URL, or upload below…"
                            className={fieldCls}
                        />
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="article-cover-file"
                                className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-medium border border-white/10 transition-colors ${
                                    isUploading ? 'opacity-50 pointer-events-none bg-white/5 text-gray-500' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {isUploading ? 'Uploading…' : '⬆ Upload from file'}
                            </label>
                            <input
                                id="article-cover-file"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
                                disabled={isUploading}
                            />
                            {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}
                        </div>
                        {coverUrl && (
                            <img src={coverUrl} alt="Cover preview" className="mt-1 rounded-lg max-h-40 object-cover border border-white/10" />
                        )}
                    </div>
                </div>

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
                            <label htmlFor="article-category" className="block text-xs font-medium text-gray-400 mb-1">Category <span className="text-red-400">*</span></label>
                            <select id="article-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={fieldCls}>
                                <option value="">Select category…</option>
                                {dbCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="px-5 py-2 rounded-lg text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-40"
                        >
                            {saving ? 'Saving…' : 'Save Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
                        >
                            {saving ? 'Publishing…' : 'Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleEditor

