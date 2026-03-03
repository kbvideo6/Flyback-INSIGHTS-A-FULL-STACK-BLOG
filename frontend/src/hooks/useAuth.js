// useAuth — Authentication hook (stubbed, ready for Supabase wiring)
// TODO: Replace stub logic with real Supabase auth calls once backend is ready.
//
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// )

import { useState, useEffect } from 'react'

const useAuth = () => {
    // Stub: treat any stored 'admin-session' flag as logged in
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('admin-session')
        return stored ? JSON.parse(stored) : null
    })
    const [loading, setLoading] = useState(false)

    // TODO: Replace with supabase.auth.onAuthStateChange
    useEffect(() => {
        // No-op in stub mode
    }, [])

    /**
     * Sign in with email + password.
     * TODO: Replace with → supabase.auth.signInWithPassword({ email, password })
     */
    const signIn = async (email, password) => {
        setLoading(true)
        try {
            // Stub: accept any credentials, store a fake user object
            if (!email || !password) throw new Error('Email and password are required.')
            const fakeUser = { email, role: 'admin' }
            sessionStorage.setItem('admin-session', JSON.stringify(fakeUser))
            setUser(fakeUser)
            return fakeUser
        } finally {
            setLoading(false)
        }
    }

    /**
     * Sign out the current user.
     * TODO: Replace with → supabase.auth.signOut()
     */
    const signOut = async () => {
        sessionStorage.removeItem('admin-session')
        setUser(null)
    }

    return {
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut,
    }
}

export default useAuth
