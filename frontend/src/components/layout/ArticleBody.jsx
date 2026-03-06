// ArticleBody — Visually rich renderer for structured JSON article content
//
// Handles the following block types:
//   { type: 'paragraph', content: '...' }
//   { type: 'heading',   content: '...' }
//   { type: 'subheading',content: '...' }
//   { type: 'quote',     content: '...',  author?: '...' }
//   { type: 'callout',   content: '...',  label?: '...' }
//   { type: 'list',      items: ['...']  }
//   { type: 'code',      content: '...',  language?: '...' }
//   { type: 'divider' }
//   { type: 'image',     url: '...',      caption?: '...' }
//
// Also accepts an optional `imageUrl` prop — renders a full-width inline
// image (from the article's image_url column) before the body.

const ArticleBody = ({ content, imageUrl }) => {
    // content may arrive as a string (JSON) or already-parsed array
    let blocks = []
    if (Array.isArray(content)) {
        blocks = content
    } else if (typeof content === 'string') {
        try { blocks = JSON.parse(content) } catch { /* fallback below */ }
    }

    // If no structured blocks, render content as plain text
    if (!blocks.length && typeof content === 'string' && content.trim()) {
        return (
            <div className="space-y-6">
                {imageUrl && <InlineImage url={imageUrl} />}
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed">{content}</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* Optional article image_url rendered as a prominent inline image */}
            {imageUrl && <InlineImage url={imageUrl} className="mb-8" />}

            {blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} index={i} />
            ))}
        </div>
    )
}

/* ── Individual block renderers ──────────────────────────────────────── */

const BlockRenderer = ({ block, index }) => {
    switch (block.type) {

        case 'heading':
            return <HeadingBlock content={block.content} index={index} />

        case 'subheading':
            return <SubHeadingBlock content={block.content} />

        case 'paragraph':
            return <ParagraphBlock content={block.content} />

        case 'quote':
            return <QuoteBlock content={block.content} author={block.author} />

        case 'callout':
            return <CalloutBlock content={block.content} label={block.label} />

        case 'list':
            return <ListBlock items={block.items ?? []} />

        case 'code':
            return <CodeBlock content={block.content} language={block.language} />

        case 'divider':
            return <DividerBlock />

        case 'image':
            return <InlineImage url={block.url} caption={block.caption} />

        default:
            // Unknown type — fall back to rendering content as a paragraph
            if (block.content) return <ParagraphBlock content={block.content} />
            return null
    }
}

/* ── Heading ─────────────────────────────────────────────────────── */
const HeadingBlock = ({ content, index }) => (
    <div className={`${index > 0 ? 'mt-12' : 'mt-6'} mb-4`}>
        {/* Blue accent bar */}
        <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-6 rounded-full bg-primary flex-shrink-0" />
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-white leading-snug">
            {content}
        </h2>
    </div>
)

/* ── Sub-heading ──────────────────────────────────────────────── */
const SubHeadingBlock = ({ content }) => (
    <h3 className="font-display text-xl lg:text-2xl font-semibold text-gray-100 mt-8 mb-3">
        {content}
    </h3>
)

/* ── Paragraph ───────────────────────────────────────────────── */
const ParagraphBlock = ({ content }) => (
    <p className="text-gray-300 text-base lg:text-lg leading-[1.85] tracking-[0.01em] mt-4">
        {content}
    </p>
)

/* ── Block quote ─────────────────────────────────────────────── */
const QuoteBlock = ({ content, author }) => (
    <figure
        className="my-10 mx-0 lg:mx-6"
        style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderLeft: '4px solid #3B82F6',
            borderRadius: '0 1rem 1rem 0',
            padding: '1.5rem 1.75rem',
        }}
    >
        <blockquote className="font-display text-xl lg:text-2xl italic text-white/90 leading-snug">
            &ldquo;{content}&rdquo;
        </blockquote>
        {author && (
            <figcaption className="mt-3 text-sm text-gray-400 font-medium">
                — {author}
            </figcaption>
        )}
    </figure>
)

/* ── Callout / Key Insight box ───────────────────────────────── */
const CalloutBlock = ({ content, label = 'Key Insight' }) => (
    <div
        className="my-8 flex gap-4"
        style={{
            background: 'rgba(59,130,246,0.07)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
        }}
    >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
            <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                background: 'rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#60a5fa" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                </svg>
            </div>
        </div>
        <div>
            <p className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-1">{label}</p>
            <p className="text-gray-200 text-base leading-relaxed">{content}</p>
        </div>
    </div>
)

/* ── Bullet list ─────────────────────────────────────────────── */
const ListBlock = ({ items }) => (
    <ul className="mt-4 space-y-3 pl-1">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300 text-base lg:text-lg leading-relaxed">
                <span
                    className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                />
                {item}
            </li>
        ))}
    </ul>
)

/* ── Inline code block ───────────────────────────────────────── */
const CodeBlock = ({ content, language }) => (
    <div
        className="my-8 rounded-xl overflow-hidden"
        style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
        }}
    >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <div className="flex gap-1.5">
                {['#f87171', '#fbbf24', '#4ade80'].map(c => (
                    <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
            </div>
            {language && (
                <span className="text-gray-500 text-xs font-mono tracking-wide uppercase">{language}</span>
            )}
        </div>
        <pre className="px-5 py-4 overflow-x-auto text-sm font-mono text-green-300 leading-relaxed">
            <code>{content}</code>
        </pre>
    </div>
)

/* ── Section divider ─────────────────────────────────────────── */
const DividerBlock = () => (
    <div className="my-10 flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
                <span key={i} className="w-1 h-1 rounded-full bg-gray-600" />
            ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-glass-border to-transparent" />
    </div>
)

/* ── Inline image (from block or image_url column) ───────────── */
const InlineImage = ({ url, caption, className = '' }) => {
    if (!url) return null
    return (
        <figure className={`my-10 ${className}`}>
            <div className="overflow-hidden rounded-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <img
                    src={url}
                    alt={caption ?? ''}
                    className="w-full object-cover"
                    style={{ maxHeight: '480px' }}
                    loading="lazy"
                />
            </div>
            {caption && (
                <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}

export default ArticleBody
