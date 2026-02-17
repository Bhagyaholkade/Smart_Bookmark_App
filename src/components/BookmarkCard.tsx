'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface BookmarkCardProps {
    bookmark: {
        id: string
        url: string
        title: string
        created_at: string
    }
    onDelete: (id: string) => void
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
    const [deleting, setDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowConfirm(true)
    }

    const handleConfirmDelete = async () => {
        setDeleting(true)
        const { error } = await supabase.from('bookmarks').delete().eq('id', bookmark.id)
        if (!error) {
            onDelete(bookmark.id)
        }
        setDeleting(false)
        setShowConfirm(false)
    }

    let hostname = ''
    try {
        hostname = new URL(bookmark.url).hostname.replace('www.', '')
    } catch {
        hostname = bookmark.url
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`

    const timeAgo = getTimeAgo(bookmark.created_at)

    return (
        <>
            <motion.a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bookmark-card p-6 group flex flex-col cursor-pointer no-underline"
            >
                {/* Top: favicon + domain + actions */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center p-1.5 border border-white/[0.06] shrink-0 group-hover:border-primary/25 transition-all duration-500">
                            <img
                                src={faviconUrl}
                                alt=""
                                className="w-full h-full object-contain rounded"
                                onError={(e) => {
                                    const el = e.target as HTMLImageElement
                                    el.style.display = 'none'
                                    el.parentElement!.innerHTML = '<svg class="w-4 h-4 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                                }}
                            />
                        </div>
                        <span className="text-[11px] font-semibold text-white/25 truncate tracking-wide uppercase">{hostname}</span>
                    </div>

                    <div className="flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shrink-0">
                        <button
                            onClick={handleDeleteClick}
                            disabled={deleting}
                            className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/[0.06] hover:border-red-500/20 disabled:opacity-40"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-display text-[17px] font-bold text-white/90 leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                    {bookmark.title}
                </h3>

                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/15 font-medium">
                        <Clock className="w-3 h-3" />
                        {timeAgo}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-primary/40 font-semibold group-hover:text-primary/70 transition-colors">
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                    </div>
                </div>
            </motion.a>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center px-5">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirm(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/60 bg-[#151221] border border-white/[0.08]"
                        >
                            {/* Red top accent */}
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                            <div className="p-6 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5 border border-red-500/20">
                                    <AlertTriangle className="w-7 h-7 text-red-400" />
                                </div>

                                <h3 className="font-display text-lg font-bold text-white mb-2">Delete Bookmark?</h3>
                                <p className="text-sm text-white/40 mb-1 font-medium truncate px-2">{bookmark.title}</p>
                                <p className="text-xs text-white/20 mb-6">This action cannot be undone.</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 py-3 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-semibold text-white/60 hover:bg-white/[0.08] hover:text-white/80 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={deleting}
                                        className="flex-1 py-3 px-4 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {deleting ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

function getTimeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
