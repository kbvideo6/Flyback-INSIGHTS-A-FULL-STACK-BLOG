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

// ── Custom Image Extension with Resizing ──────────────────────────────────
const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => ({
                    style: `width: ${attributes.width}; height: auto; max-width: 100%; display: block; margin: 0 auto;`,
                }),
            },
        }
    },
})

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
        extensions: [
            StarterKit,
            ResizableImage.configure({ inline: false, allowBase64: false }),
        ],
        content: '<p>Start writing your article here…</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[26rem] px-6 py-5 focus:outline-none text-gray-200 leading-relaxed',
            },
        },
    })

    // ── Load categories for selection ──────────────────────────────
    const [topicTree, setTopicTree] = useState([])
    const [selectedParentId, setSelectedParentId] = useState('')
    const [selectedSubId, setSelectedSubId] = useState('')

    const [isCreatingCat, setIsCreatingCat] = useState(false)
    const [isCreatingSub, setIsCreatingSub] = useState(false)

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')
        if (!error && data) {
            const parents = data.filter(c => !c.parent_id)
            const children = data.filter(c => c.parent_id)
            const tree = parents.map(p => ({
                ...p,
                subtopics: children.filter(c => c.parent_id === p.id)
            }))
            setTopicTree(tree)
            return { tree, all: data }
        }
        return { tree: [], all: [] }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    // ── Load existing article when editing ───────────────────────────────
    useEffect(() => {
        if (!isNew && editor) {
            Promise.all([
                supabase.from('articles').select('*, categories(*)').eq('id', id).single(),
                fetchCategories()
            ]).then(([{ data: article, error: err }, { all: allCats }]) => {
                if (err) { setSaveError(`Could not load article: ${err.message}`); return }
                setTitle(article.title ?? '')
                setSlug(article.slug ?? '')
                setExcerpt(article.excerpt ?? '')
                setReadTime(String(article.read_time ?? ''))
                setCoverUrl(article.cover_image_url ?? '')
                if (article.content) editor.commands.setContent(article.content)

                // Resolve category hierarchy
                const catId = article.category_id
                const currentCat = allCats.find(c => c.id === catId)
                if (currentCat) {
                    if (currentCat.parent_id) {
                        setSelectedParentId(String(currentCat.parent_id))
                        setSelectedSubId(String(currentCat.id))
                    } else {
                        setSelectedParentId(String(currentCat.id))
                        setSelectedSubId('')
                    }
                }
            })
        }
    }, [id, isNew, editor, fetchCategories])

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

    // ── Create New Category/Subcategory ────────────────────────────
    const handleCreateCategory = async () => {
        const name = window.prompt('Enter new category name:')
        if (!name) return
        setIsCreatingCat(true)
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{ name, slug: slugify(name) }])
                .select()
                .single()
            if (error) throw error
            await fetchCategories()
            setSelectedParentId(String(data.id))
            setSelectedSubId('')
        } catch (err) {
            alert(`Failed to create category: ${err.message}`)
        } finally {
            setIsCreatingCat(false)
        }
    }

    const handleCreateSubcategory = async () => {
        if (!selectedParentId) { alert('Select a main category first.'); return }
        const name = window.prompt('Enter new subcategory name:')
        if (!name) return
        setIsCreatingSub(true)
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{ name, slug: slugify(name), parent_id: parseInt(selectedParentId, 10) }])
                .select()
                .single()
            if (error) throw error
            await fetchCategories()
            setSelectedSubId(String(data.id))
        } catch (err) {
            alert(`Failed to create subcategory: ${err.message}`)
        } finally {
            setIsCreatingSub(false)
        }
    }

    // ── Save (draft or published) ─────────────────────────────────────────
    const handleSave = async (publish = false) => {
        if (!title.trim()) { setSaveError('Title is required.'); return }
        if (!slug.trim()) { setSaveError('Slug is required.'); return }

        // Use subtopic if selected, otherwise main topic
        const finalCatId = selectedSubId || selectedParentId
        if (!finalCatId) { setSaveError('Category is required.'); return }

        setSaving(true)
        setSaveError(null)

        const now = new Date().toISOString()
        const payload = {
            title,
            slug,
            excerpt,
            content: editor?.getHTML() ?? '',
            category_id: parseInt(finalCatId, 10),
            read_time: readTime ? parseInt(readTime, 10) : null,
            cover_image_url: coverUrl || null,
            is_published: publish,
            updated_at: now,
            ...(isNew ? { created_at: now, published_at: publish ? now : null } : {
                ...(publish && !article?.published_at ? { published_at: now } : {})
            })
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
        <div className="max-w-4xl mx-auto px-4 pb-16">
            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {isNew ? 'New Article' : 'Edit Article'}
                </h1>
                <button
                    type="button"
                    onClick={() => navigate('/admin/articles')}
                    className="text-gray-500 hover:text-white text-sm transition-colors text-left"
                >
                    ← Back to Dashboard
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="article-slug" className="block text-xs font-medium text-gray-400 mb-1">Slug <span className="text-red-400">*</span></label>
                            <input id="article-slug" type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" className={`${fieldCls} font-mono`} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                Main Topic <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="article-parent-category"
                                    value={selectedParentId}
                                    onChange={(e) => { setSelectedParentId(e.target.value); setSelectedSubId('') }}
                                    className={fieldCls}
                                >
                                    <option value="">Select Topic…</option>
                                    {topicTree.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={isCreatingCat}
                                    className="px-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Add New Topic"
                                >
                                    {isCreatingCat ? '...' : '+'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Subtopic</label>
                            <div className="flex gap-2">
                                <select
                                    id="article-sub-category"
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                    disabled={!selectedParentId}
                                    className={`${fieldCls} disabled:opacity-40`}
                                >
                                    <option value="">No subtopic</option>
                                    {topicTree.find(t => String(t.id) === selectedParentId)?.subtopics?.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleCreateSubcategory}
                                    disabled={!selectedParentId || isCreatingSub}
                                    className="px-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                                    title="Add New Subtopic"
                                >
                                    {isCreatingSub ? '...' : '+'}
                                </button>
                            </div>
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
                        <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-gray-800/60">
                            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><span className="w-5 h-5 flex items-center justify-center font-bold">B</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><span className="w-5 h-5 flex items-center justify-center italic font-serif">I</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><span className="w-5 h-5 flex items-center justify-center line-through">S</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><span className="px-1">H2</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><span className="px-1">H3</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><span className="px-1 text-lg">•</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><span className="px-1">1.</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><span className="text-lg">“</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><span className="text-xs">{`</>`}</span></Btn>
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

                            {/* Image Resize Controls (only show when image is selected) */}
                            {editor.isActive('image') && (
                                <>
                                    {DIVIDER}
                                    <Btn
                                        title="Small (25%)"
                                        onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}
                                    >
                                        ¼
                                    </Btn>
                                    <Btn
                                        title="Medium (50%)"
                                        onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
                                    >
                                        ½
                                    </Btn>
                                    <Btn
                                        title="Large (75%)"
                                        onClick={() => editor.chain().focus().updateAttributes('image', { width: '75%' }).run()}
                                    >
                                        ¾
                                    </Btn>
                                    <Btn
                                        title="Full (100%)"
                                        onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
                                    >
                                        Full
                                    </Btn>
                                    <Btn
                                        title="Custom Width"
                                        onClick={() => {
                                            const w = window.prompt('Enter width (e.g. 400px or 60%):', '400px')
                                            if (w) editor.chain().focus().updateAttributes('image', { width: w }).run()
                                        }}
                                    >
                                        ↔
                                    </Btn>
                                </>
                            )}
                        </div>
                    )}
                    <EditorContent editor={editor} />
                </div>

                {/* ── Action bar ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <div className="text-xs text-gray-600 order-2 sm:order-1">
                        {editor ? `${editor.storage.characterCount?.characters?.() ?? '—'} characters` : ''}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            disabled={saving}
                            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 border border-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm border border-white/10 text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-40"
                        >
                            {saving ? 'Saving…' : 'Save Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20"
                        >
                            {saving ? 'Publishing…' : 'Publish Article'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleEditor

