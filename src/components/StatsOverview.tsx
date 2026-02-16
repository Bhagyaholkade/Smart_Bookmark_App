'use client'

import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Activity, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface StatsOverviewProps {
    userId: string
}

export interface StatsOverviewRef {
    refresh: () => void
}

const StatsOverview = forwardRef<StatsOverviewRef, StatsOverviewProps>(function StatsOverview({ userId }, ref) {
    const [total, setTotal] = useState(0)
    const [todayCount, setTodayCount] = useState(0)
    const [thisWeek, setThisWeek] = useState(0)

    const fetchStats = useCallback(async () => {
        const { count: totalCount } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: todayTotal } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today.toISOString())

        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        weekAgo.setHours(0, 0, 0, 0)

        const { count: weekTotal } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', weekAgo.toISOString())

        setTotal(totalCount ?? 0)
        setTodayCount(todayTotal ?? 0)
        setThisWeek(weekTotal ?? 0)
    }, [userId])

    useImperativeHandle(ref, () => ({
        refresh: () => { fetchStats() }
    }))

    useEffect(() => {
        fetchStats()

        const channel = supabase
            .channel(`stats-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`
                },
                () => { fetchStats() }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, fetchStats])

    const stats = [
        { label: 'Total Bookmarks', value: total, icon: Bookmark, color: 'text-primary' },
        { label: 'Added Today', value: todayCount, icon: Activity, color: 'text-emerald-400' },
        { label: 'This Week', value: thisWeek, icon: Clock, color: 'text-violet-400' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="surface-card p-6 shine-card group"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:border-primary/20 transition-all duration-500">
                            <stat.icon className={`w-[18px] h-[18px] ${stat.color}`} />
                        </div>
                    </div>
                    <p className="stat-number text-3xl text-white tracking-tight">{stat.value}</p>
                    <p className="text-xs text-white/25 mt-1.5 font-medium tracking-wide">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    )
})

export default StatsOverview
