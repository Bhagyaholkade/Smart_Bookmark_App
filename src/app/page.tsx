'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import BookmarkList from '@/components/BookmarkList'
import type { BookmarkListRef } from '@/components/BookmarkList'
import AddBookmarkModal from '@/components/AddBookmarkModal'
import StatsOverview from '@/components/StatsOverview'
import type { StatsOverviewRef } from '@/components/StatsOverview'
import { Plus, ArrowRight, Shield, Zap, Lock, Trash2, Cloud, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      {!user ? <LandingPage /> : (
        <Dashboard user={user} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </main>
  )
}

/* ================================
   LANDING PAGE
   ================================ */
function LandingPage() {
  const features = [
    { icon: Shield, title: 'Google OAuth', desc: 'Secure one-click authentication. No passwords to remember.' },
    { icon: Globe, title: 'Save Anything', desc: 'Bookmark any URL with a custom title in one click.' },
    { icon: Zap, title: 'Real-time Sync', desc: 'Instant updates across all your open tabs simultaneously.' },
    { icon: Lock, title: 'Private Vault', desc: 'Row-level security ensures only you see your bookmarks.' },
    { icon: Trash2, title: 'Quick Delete', desc: 'Remove bookmarks instantly with one click.' },
    { icon: Cloud, title: 'Edge Deployed', desc: 'Hosted on Vercel for blazing speed worldwide.' },
  ]

  return (
    <div className="pt-16 overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-light mb-12"
            >
              <div className="pulse-dot" />
              <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Real-time Bookmark Manager</span>
            </motion.div>

            <h1 className="font-display font-black leading-[0.85] tracking-tight mb-12 select-none">
              <span className="block text-gradient-white text-[5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[11rem]">SAVE</span>
              <span className="block text-stroke text-[4.5rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9.5rem] xl:text-[10.5rem] opacity-70">ORGANIZE</span>
              <span className="block text-gradient-purple text-[5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[11rem]">SYNC</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-light"
            >
              The modern platform for saving, organizing, and syncing your bookmarks. Built for people who value simplicity and speed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                className="btn-glow group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="glow-line" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5">
              Everything you need
            </h2>
            <p className="text-white/25 max-w-lg mx-auto text-base">
              Powerful features wrapped in a beautiful interface. No complexity, just what matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="surface-card p-8 shine-card group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/15 group-hover:bg-primary/15 group-hover:border-primary/25 transition-all duration-500">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2.5">{feature.title}</h3>
                <p className="text-sm text-white/25 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glow-line mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Ready to get started?
            </h2>
            <p className="text-white/25 mb-10 text-base max-w-md mx-auto">
              Sign in with your Google account and start saving your bookmarks in seconds.
            </p>
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
              className="btn-glow group"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

/* ================================
   DASHBOARD
   ================================ */
function Dashboard({ user, isModalOpen, setIsModalOpen }: {
  user: User
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
}) {
  const bookmarkListRef = useRef<BookmarkListRef>(null)
  const statsRef = useRef<StatsOverviewRef>(null)

  const handleBookmarkAdded = (bookmark: { id: string; url: string; title: string; created_at: string }) => {
    bookmarkListRef.current?.addBookmark(bookmark)
    statsRef.current?.refresh()
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="pulse-dot" />
              <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Dashboard</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Your Bookmarks
            </h1>
            <p className="text-sm text-white/25 mt-2">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-glow btn-small"
          >
            <Plus className="w-4 h-4" />
            Add Bookmark
          </motion.button>
        </motion.div>

        {/* Stats */}
        <StatsOverview ref={statsRef} userId={user.id} />

        {/* Bookmarks list */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h2 className="font-display text-xl font-bold text-white/80">Collection</h2>
          </div>
          <BookmarkList ref={bookmarkListRef} userId={user.id} onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user.id}
        onBookmarkAdded={handleBookmarkAdded}
      />
    </div>
  )
}
