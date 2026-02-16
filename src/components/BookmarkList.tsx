'use client'

import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { supabase } from '@/lib/supabase'
import BookmarkCard from './BookmarkCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark as BookmarkIcon, Plus } from 'lucide-react'

interface Bookmark {
    id: string
    url: string
    title: string
    created_at: string
}

interface BookmarkListProps {
    userId: string
    onOpenModal?: () => void
}

export interface BookmarkListRef {
    addBookmark: (bookmark: Bookmark) => void
}

const BookmarkList = forwardRef<BookmarkListRef, BookmarkListProps>(function BookmarkList({ userId, onOpenModal }, ref) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)

    useImperativeHandle(ref, () => ({
        addBookmark: (bookmark: Bookmark) => {
            setBookmarks((prev) => {
                if (prev.some((b) => b.id === bookmark.id)) return prev
                return [bookmark, ...prev]
            })
        }
    }))

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setBookmarks(data)
            }
            setLoading(false)
        }

        fetchBookmarks()

        const channel = supabase
            .channel(`bookmarks-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    const newBookmark = payload.new as Bookmark
                    setBookmarks((prev) => {
                        if (prev.some((b) => b.id === newBookmark.id)) return prev
                        return [newBookmark, ...prev]
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    const handleDelete = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-white/[0.08] py-24 text-center"
            >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center mx-auto mb-7 border border-primary/15">
                    <BookmarkIcon className="w-9 h-9 text-primary/40" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white/50 mb-2">No bookmarks yet</h3>
                <p className="text-sm text-white/20 max-w-sm mx-auto mb-8">
                    Start building your collection by saving your first bookmark.
                </p>
                {onOpenModal && (
                    <button onClick={onOpenModal} className="btn-glow btn-small">
                        <Plus className="w-4 h-4" />
                        Add Your First Bookmark
                    </button>
                )}
            </motion.div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode='popLayout'>
                {bookmarks.map((bookmark) => (
                    <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onDelete={handleDelete}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
})

export default BookmarkList
