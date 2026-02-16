'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { LogOut, Bookmark, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        })
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setShowMenu(false)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="glass border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                            <Bookmark className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display text-lg font-bold tracking-tight text-white/90">
                            Bookmark<span className="text-primary">App</span>
                        </span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <button onClick={handleLogin} className="btn-glow btn-small">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Sign in
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                                >
                                    {user.user_metadata?.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt=""
                                            className="w-8 h-8 rounded-full border border-white/10"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/20">
                                            <span className="text-xs font-bold text-white">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-white/60 hidden sm:inline">
                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-white/25 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showMenu && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-60 glass rounded-xl p-1.5 z-50 shadow-2xl shadow-black/50"
                                            >
                                                <div className="px-3 py-3 border-b border-white/[0.05] mb-1">
                                                    <p className="text-sm font-semibold text-white/80 truncate">
                                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                                    </p>
                                                    <p className="text-xs text-white/25 truncate mt-0.5">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign out
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
