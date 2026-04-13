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
        onUpdate: ({ editor }) => {
            // Auto-calculate read time: ~200 words per minute
            const text = editor.getText()
            const words = text.trim().split(/\s+/).length
            const minutes = Math.max(1, Math.ceil(words / 200))
            setReadTime(String(minutes))
        },
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
        const now = new Date().toISOString()
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{ name, slug: slugify(name), created_at: now, updated_at: now }])
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
        const now = new Date().toISOString()
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{
                    name,
                    slug: slugify(name),
                    parent_id: parseInt(selectedParentId, 10),
                    created_at: now,
                    updated_at: now
                }])
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
        const parsedCatId = parseInt(finalCatId, 10)
        
        if (!finalCatId || isNaN(parsedCatId)) { 
            setSaveError('A valid Category or Subcategory must be selected.'); 
            return 
        }

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
    const fieldCls = 'w-full bg-background-dark border border-glass-border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all'

    return (
        <div className="max-w-4xl mx-auto px-4 pb-16">
            {/* Page heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--logo-color)' }}>
                    {isNew ? 'New Entry' : 'Refine Article'}
                </h1>
                <button
                    type="button"
                    onClick={() => navigate('/admin/articles')}
                    className="text-primary hover:text-blue-600 text-sm font-bold transition-colors text-left uppercase tracking-widest"
                >
                    ← Dashboard
                </button>
            </div>

            {/* Save error */}
            {saveError && (
                <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
                    {saveError}
                </div>
            )}

            <div className="space-y-8">
                {/* ── Cover image ── */}
                <div className="glass-panel p-6 border-glass-border bg-white/[0.02]">
                    <label className="block text-[11px] font-black tracking-widest text-primary uppercase mb-5">Imagery & Graphics</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="space-y-5">
                            <input
                                id="article-cover-url"
                                type="url"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                placeholder="https://source.unsplash.com/..."
                                className={fieldCls}
                            />
                            <p className="text-[10px] text-gray-500 italic leading-relaxed">
                                Provide a high-density image URL (1200x630 min) for premium social distribution.
                            </p>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="article-cover-file"
                                    className={`cursor-pointer px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-glass-border transition-all ${
                                        isUploading ? 'opacity-40 pointer-events-none' : 'bg-primary/5 text-primary hover:bg-primary/15'
                                    }`}
                                >
                                    {isUploading ? 'Uploading…' : '⬆ Local Upload'}
                                </label>
                                <input
                                    id="article-cover-file"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }}
                                    disabled={isUploading}
                                />
                                {uploadError && <p className="text-red-500 text-[10px] font-bold">{uploadError}</p>}
                            </div>
                        </div>
                        <div className="aspect-video bg-background-dark/40 border border-glass-border rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner">
                            {coverUrl ? (
                                <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center px-4">
                                    <span className="block text-4xl mb-3 opacity-10">🖼</span>
                                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-black opacity-30">Projection Preview</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Metadata ── */}
                <div className="glass-panel p-8 border-glass-border space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="article-title" className="block text-[11px] font-black tracking-widest text-primary uppercase mb-2">Technical Title <span className="text-red-500">*</span></label>
                        <input id="article-title" type="text" required value={title} onChange={handleTitleChange} placeholder="GaN vs SiC: The 2025 Efficiency Gap" className={`${fieldCls} text-lg font-bold`} />
                    </div>

                    {/* Slug + Category */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="article-slug" className="block text-[11px] font-black tracking-widest text-primary uppercase mb-2">Canonical Slug <span className="text-red-500">*</span></label>
                            <input id="article-slug" type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" className={`${fieldCls} font-mono italic`} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black tracking-widest text-primary uppercase mb-2">
                                Primary Domain <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="article-parent-category"
                                    value={selectedParentId}
                                    onChange={(e) => { setSelectedParentId(e.target.value); setSelectedSubId('') }}
                                    className={fieldCls}
                                >
                                    <option value="">Select Domain…</option>
                                    {topicTree.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={isCreatingCat}
                                    className="px-4 bg-primary/5 border border-glass-border rounded-lg text-primary hover:bg-primary/15 transition-all font-black text-lg"
                                    title="Add New Topic"
                                >
                                    {isCreatingCat ? '…' : '+'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black tracking-widest text-primary uppercase mb-2">Specialization</label>
                            <div className="flex gap-2">
                                <select
                                    id="article-subtopic"
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                    disabled={!selectedParentId}
                                    className={`${fieldCls} disabled:opacity-30`}
                                >
                                    <option value="">Full Coverage</option>
                                    {topicTree.find(t => String(t.id) === selectedParentId)?.subtopics?.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleCreateSubcategory}
                                    disabled={!selectedParentId || isCreatingSub}
                                    className="px-4 bg-primary/5 border border-glass-border rounded-lg text-primary hover:bg-primary/15 transition-all disabled:opacity-30 font-black text-lg"
                                    title="Add New Subtopic"
                                >
                                    {isCreatingSub ? '…' : '+'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt + Read time */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-3">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="article-excerpt" className="block text-[11px] font-black tracking-widest text-primary uppercase">Executive Summary</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const text = editor?.getText().slice(0, 160).trim()
                                        if (text) setExcerpt(text + (text.length >= 160 ? '…' : ''))
                                    }}
                                    className="text-[10px] font-black text-primary hover:text-blue-600 transition-colors uppercase tracking-[0.05em]"
                                >
                                    ✨ Auto‑Synth
                                </button>
                            </div>
                            <textarea id="article-excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Condensed insight for grid previews…" className={`${fieldCls} resize-none leading-relaxed`} />
                        </div>
                        <div>
                            <label htmlFor="article-readtime" className="block text-[11px] font-black tracking-widest text-primary uppercase mb-2">Read Velocity</label>
                            <input id="article-readtime" type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="8 MIN READ" className={`${fieldCls} font-mono`} />
                        </div>
                    </div>
                </div>

                {/* ── Rich text editor ── */}
                <div className="glass-panel border-glass-border overflow-hidden shadow-lg">
                    {/* Toolbar */}
                    {editor && (
                        <div className="flex flex-wrap items-center gap-1.5 px-5 py-4 border-b border-glass-border bg-background-dark/60 backdrop-blur-md">
                            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><span className="w-5 h-5 flex items-center justify-center font-bold">B</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><span className="w-5 h-5 flex items-center justify-center italic font-serif">I</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><span className="w-5 h-5 flex items-center justify-center line-through">S</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><span className="px-1.5 font-bold">H2</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><span className="px-1.5 font-bold">H3</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><span className="px-1.5 text-xl leading-none">•</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><span className="px-1.5 font-bold">1.</span></Btn>
                            {DIVIDER}
                            <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><span className="text-2xl leading-none">“</span></Btn>
                            <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block"><span className="text-xs font-mono">{`</>`}</span></Btn>
                            <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule" className="font-bold">—</Btn>
                            {DIVIDER}
                            {/* Insert image from URL */}
                            <Btn
                                title="Insert image URL"
                                onClick={() => {
                                    const url = window.prompt('Image URL:')
                                    if (url) editor.chain().focus().setImage({ src: url }).run()
                                }}
                            >
                                <span className="text-lg">🖼</span>
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
                                        FULL
                                    </Btn>
                                </>
                            )}
                        </div>
                    )}
                    <EditorContent editor={editor} />
                </div>

                {/* ── Action bar ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest order-2 sm:order-1">
                        {editor ? `${editor.storage.characterCount?.characters?.() ?? '0'} PROCESSED CHARACTERS` : ''}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 order-1 sm:order-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            disabled={saving}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-40"
                        >
                            Abort
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-glass-border text-primary hover:bg-primary/5 transition-all disabled:opacity-40 shadow-sm"
                        >
                            {saving ? 'STASHING…' : 'Save Draft'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="w-full sm:w-auto bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-black uppercase tracking-[0.1em] px-10 py-3.5 rounded-xl text-xs transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02]"
                        >
                            {saving ? 'Transmitting…' : 'Publish Article'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleEditor

