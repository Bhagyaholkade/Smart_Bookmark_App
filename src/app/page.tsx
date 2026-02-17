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
    // Clean up any hash fragments with tokens from the URL
    if (window.location.hash && window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Clean URL after auth state change
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
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
    <div className="pt-20 overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-8">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-light mb-6"
              >
                <div className="pulse-dot" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase">Best Choice</span>
              </motion.div>

              <h1 className="font-display font-black leading-[1.1] mb-6 select-none">
                <span className="block text-white text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[5.5rem]">
                  BOOKMARKS
                </span>
                <span className="block text-white text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[5.5rem] -mt-3 sm:-mt-4">
                  FOR ALL
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base md:text-lg text-white/60 max-w-lg mb-6 leading-relaxed"
              >
                Save your favorite links in one place. Powered by <span className="text-primary font-semibold">Google OAuth</span> and <span className="text-primary font-semibold">real-time sync</span>, your bookmarks stay private and instantly updated across all your tabs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })}
                  className="btn-glow group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-sm text-white/40">Start organizing today</span>
              </motion.div>
            </motion.div>

            {/* Right Side - Decorative Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[450px] hidden lg:flex items-end justify-center pb-8"
            >
              <div className="relative w-full max-w-[550px] h-[400px]">
                {/* Card 1 - Orange (Left) */}
                <motion.div
                  initial={{ rotate: 0, y: 80, opacity: 0 }}
                  animate={{ rotate: -20, y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-[8%] w-[155px] h-[340px] rounded-[1.75rem] shadow-2xl overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                    transformOrigin: 'bottom center'
                  }}
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 rounded-full bg-white" />
                  </div>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 -rotate-90 origin-center">
                    <span className="text-white font-black text-[1.35rem] tracking-[0.25em] whitespace-nowrap drop-shadow-lg">CLASSIC</span>
                  </div>
                </motion.div>

                {/* Card 2 - Blue (Center) */}
                <motion.div
                  initial={{ rotate: 0, y: 80, opacity: 0 }}
                  animate={{ rotate: -2, y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[155px] h-[360px] rounded-[1.75rem] shadow-2xl overflow-hidden z-10"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    transformOrigin: 'bottom center'
                  }}
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 rounded-full bg-white" />
                  </div>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 -rotate-90 origin-center">
                    <span className="text-white font-black text-[1.35rem] tracking-[0.25em] whitespace-nowrap drop-shadow-lg">MODERN ART</span>
                  </div>
                </motion.div>

                {/* Card 3 - Yellow (Right) */}
                <motion.div
                  initial={{ rotate: 0, y: 80, opacity: 0 }}
                  animate={{ rotate: 25, y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-0 right-[8%] w-[155px] h-[340px] rounded-[1.75rem] shadow-2xl overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    transformOrigin: 'bottom center'
                  }}
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 rounded-full bg-white" />
                  </div>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 -rotate-90 origin-center">
                    <span className="text-white font-black text-[1.35rem] tracking-[0.25em] whitespace-nowrap drop-shadow-lg">NONFICTION</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
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
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })}
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
