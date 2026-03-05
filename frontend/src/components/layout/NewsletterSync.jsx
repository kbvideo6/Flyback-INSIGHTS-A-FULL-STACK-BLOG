// NewsletterSync — Email signup bar shown on every page
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const NewsletterSync = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        setMessage('')

        try {
            const { error } = await supabase.from('subscribers').insert([{ email }])
            if (error && error.code !== '23505') throw new Error(error.message)
            setStatus('success')
            setMessage("You're subscribed! Check your inbox.")
            setEmail('')
        } catch (err) {
            setStatus('error')
            setMessage(err.message ?? 'Something went wrong. Please try again.')
        }
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
            <div className="glass-panel px-6 py-5 lg:px-8 lg:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* ── Text ── */}
                <div className="text-center sm:text-left flex-shrink-0">
                    <h3 className="font-display italic font-bold text-white text-lg leading-tight">
                        Newsletter Sync
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                        Receive daily intelligence updates.
                    </p>
                </div>

                {/* ── Form or feedback ── */}
                {status === 'success' ? (
                    <p className="text-green-400 text-sm font-medium">{message}</p>
                ) : (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 w-full sm:w-auto"
                        >
                            <input
                                id="newsletter-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                disabled={status === 'loading'}
                                className="bg-gray-800/60 border border-gray-700/50 text-gray-300 placeholder-gray-500 text-sm rounded-lg px-4 py-2.5 w-full sm:w-56 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-white hover:bg-gray-200 disabled:opacity-50 text-background-dark p-2.5 rounded-lg transition-colors flex-shrink-0"
                                aria-label="Subscribe"
                            >
                                {status === 'loading' ? (
                                    <span className="inline-block w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                )}
                            </button>
                        </form>
                        {status === 'error' && (
                            <p className="text-red-400 text-xs">{message}</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default NewsletterSync

