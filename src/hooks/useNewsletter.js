// useNewsletter — subscribe / unsubscribe via the existing `subscribers` table
// (same table used by NewsletterSync.jsx)
//
// Schema assumed (matches existing usage in NewsletterSync.jsx):
//   subscribers ( email text unique, ... )
//
// Usage:
//   const { subscribe, unsubscribe, status, message, reset } = useNewsletter()

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const TABLE = 'subscribers'

const useNewsletter = () => {
    // 'idle' | 'loading' | 'success' | 'error'
    const [status, setStatus] = useState('idle')
    const [message, setMessage] = useState('')

    const reset = useCallback(() => {
        setStatus('idle')
        setMessage('')
    }, [])

    /** Subscribe — inserts the email. Treats duplicate (23505) as already-subscribed, not an error. */
    const subscribe = useCallback(async (email) => {
        setStatus('loading')
        setMessage('')
        try {
            const { error } = await supabase
                .from(TABLE)
                .insert([{ email: email.toLowerCase().trim() }])

            if (error && error.code === '23505') {
                // Already in the table → friendly success
                setStatus('success')
                setMessage(`✅ ${email} is already subscribed!`)
                return
            }
            if (error) throw new Error(error.message)

            setStatus('success')
            setMessage(`🎉 You're subscribed! Check your inbox for updates.`)
        } catch (err) {
            setStatus('error')
            setMessage(err.message ?? 'Something went wrong. Please try again.')
        }
    }, [])

    /** Unsubscribe — deletes the row for this email from the subscribers table. */
    const unsubscribe = useCallback(async (email) => {
        setStatus('loading')
        setMessage('')
        try {
            const normalized = email.toLowerCase().trim()

            // First check the email actually exists
            const { data: existing, error: fetchErr } = await supabase
                .from(TABLE)
                .select('email')
                .eq('email', normalized)
                .maybeSingle()

            if (fetchErr) throw new Error(fetchErr.message)

            if (!existing) {
                setStatus('error')
                setMessage(`${email} is not currently subscribed.`)
                return
            }

            const { error: deleteErr } = await supabase
                .from(TABLE)
                .delete()
                .eq('email', normalized)

            if (deleteErr) throw new Error(deleteErr.message)

            setStatus('success')
            setMessage(`👋 ${email} has been unsubscribed. Sorry to see you go!`)
        } catch (err) {
            setStatus('error')
            setMessage(err.message ?? 'Something went wrong. Please try again.')
        }
    }, [])

    return { subscribe, unsubscribe, status, message, reset }
}

export default useNewsletter
