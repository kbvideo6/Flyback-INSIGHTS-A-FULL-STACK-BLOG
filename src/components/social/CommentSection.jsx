// CommentSection — Anonymous technical discussion feed
import { useState } from 'react'

const CommentSection = ({ comments = [], onAddComment, isLoading }) => {
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMsg, setStatusMsg] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !content.trim()) return

        setIsSubmitting(true)
        setStatusMsg(null)
        
        const result = await onAddComment(name.trim(), content.trim())
        
        if (result.success) {
            setContent('')
            setStatusMsg({ type: 'success', text: 'Log entry added successfully.' })
        } else {
            setStatusMsg({ type: 'error', text: 'Transmission failed. Try again.' })
        }
        
        setIsSubmitting(false)
        setTimeout(() => setStatusMsg(null), 3000)
    }

    return (
        <section className="mt-16 pt-12 border-t border-glass-border">
            <h3 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Technical Logs / Discussion
            </h3>

            {/* Comment Form */}
            <div className="glass-panel p-6 mb-12 border-primary/20">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">User Identifier</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ANONYMOUS_ENGINEER"
                                maxLength={30}
                                className="w-full bg-black/20 border border-glass-border rounded-xl p-3 text-sm text-white font-mono outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Transmission Data / Message</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share technical feedback, questions, or log entries..."
                            className="w-full bg-black/20 border border-glass-border rounded-xl p-4 text-sm text-white font-mono outline-none focus:border-primary/50 transition-colors min-h-[120px] resize-none"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Anonymous session active</p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting ? 'Transmitting...' : 'Initialize Log Post'}
                        </button>
                    </div>
                    {statusMsg && (
                        <div className={`text-center text-[10px] font-black uppercase tracking-widest mt-4 ${statusMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {statusMsg.text}
                        </div>
                    )}
                </form>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="py-12 text-center text-gray-500 font-mono text-xs italic">Fetching technical logs...</div>
                ) : comments.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 font-mono text-xs italic">No log entries found for this article ID. Be the first to initialize discussion.</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="relative group pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-glass-border group-hover:bg-primary transition-colors" />
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{comment.author_name}</span>
                                <span className="text-[8px] text-gray-600 font-bold">[{new Date(comment.created_at).toLocaleString()}]</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-mono opacity-90">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default CommentSection
