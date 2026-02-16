'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Link as LinkIcon, Type, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Bookmark {
    id: string
    url: string
    title: string
    created_at: string
    user_id: string
}

interface AddBookmarkModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    onBookmarkAdded: (bookmark: Bookmark) => void
}

export default function AddBookmarkModal({ isOpen, onClose, userId, onBookmarkAdded }: AddBookmarkModalProps) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error: insertError } = await supabase
            .from('bookmarks')
            .insert([{ url, title, user_id: userId }])
            .select()
            .single()

        setLoading(false)
        if (!insertError && data) {
            onBookmarkAdded(data as Bookmark)
            setUrl('')
            setTitle('')
            onClose()
        } else {
            setError(insertError?.message || 'Failed to save bookmark')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-lg glass rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
                    >
                        {/* Purple top accent line */}
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                        <div className="p-8 sm:p-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-white tracking-tight">New Bookmark</h2>
                                        <p className="text-xs text-white/25 mt-0.5">Save a link to your collection</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/25 hover:text-white/50 transition-all border border-white/[0.06]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/15 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-white/35 uppercase tracking-widest ml-0.5">URL Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <LinkIcon className="h-4 w-4 text-white/15" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                            className="input-dark"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-white/35 uppercase tracking-widest ml-0.5">Bookmark Title</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Type className="h-4 w-4 text-white/15" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="My awesome bookmark"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="input-dark"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-glow justify-center py-4 mt-3 disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Save Bookmark
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
