// Contact Page
import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'

const CHANNELS = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        label: 'Email',
        value: 'hello@flybackelectronics.com',
        href: 'mailto:hello@flybackelectronics.com',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        label: 'Press & Media',
        value: 'press@flybackelectronics.com',
        href: 'mailto:press@flybackelectronics.com',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        label: 'Partnerships',
        value: 'partners@flybackelectronics.com',
        href: 'mailto:partners@flybackelectronics.com',
    },
]

const Contact = () => {
    usePageTitle('Contact')
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        // In production this would POST to an API — for now just show success
        setSent(true)
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-16">

            {/* ── Header ── */}
            <div className="mb-14">
                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase bg-blue-900/40 border border-blue-500/30 rounded-full">
                    Get in Touch
                </span>
                <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    Let's Start a<br />
                    <span className="text-primary">Conversation</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl">
                    Have a tip, story idea, or want to collaborate? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* ── Left: contact channels ── */}
                <div className="lg:col-span-2 space-y-4">
                    {CHANNELS.map(({ icon, label, value, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="glass-panel p-5 flex items-start gap-4 group hover:border-primary/30 transition-all duration-300 block"
                        >
                            <span className="mt-0.5 text-primary flex-shrink-0">{icon}</span>
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">{label}</p>
                                <p className="text-sm text-gray-200 group-hover:text-primary transition-colors break-all">{value}</p>
                            </div>
                        </a>
                    ))}

                    {/* Decorative blurb */}
                    <div className="pt-4 border-t border-glass-border">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            We typically respond within 1–2 business days. For urgent press inquiries, please use the press email above.
                        </p>
                    </div>
                </div>

                {/* ── Right: form ── */}
                <div className="lg:col-span-3 glass-panel p-8">
                    {sent ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h2>
                            <p className="text-gray-400 text-sm max-w-xs">Thanks for reaching out. We'll get back to you as soon as possible.</p>
                            <button
                                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                                className="mt-8 text-sm text-primary hover:text-blue-300 transition-colors"
                            >
                                Send another message →
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Name</label>
                                    <input
                                        name="name" type="text" required value={form.name} onChange={handleChange}
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Email</label>
                                    <input
                                        name="email" type="email" required value={form.email} onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Subject</label>
                                <input
                                    name="subject" type="text" required value={form.subject} onChange={handleChange}
                                    placeholder="What's this about?"
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/60 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Message</label>
                                <textarea
                                    name="message" required rows={6} value={form.message} onChange={handleChange}
                                    placeholder="Tell us everything..."
                                    className="w-full px-4 py-3 bg-white/5 border border-glass-border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-primary/60 transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01]"
                            >
                                Send Message
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Contact
