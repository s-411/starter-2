'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { TrendingUp, Calendar, Target, MapPin } from 'lucide-react'
import { format, differenceInDays, subMonths, startOfMonth } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { InjectionLog, Medication } from '@/types'

export default function StatsPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<InjectionLog[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const threeMonthsAgo = subMonths(new Date(), 3)

      const { data: logData } = await supabase
        .from('injection_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('injection_date', threeMonthsAgo.toISOString())
        .order('injection_date', { ascending: true })

      const { data: medData } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (logData) setLogs(logData)
      if (medData) setMedications(medData)
    } catch (error) {
      console.error('Error loading stats data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const calculateAdherence = () => {
    if (logs.length === 0 || medications.length === 0) return 0

    const medication = medications[0]
    const firstLog = logs[0]
    const lastLog = logs[logs.length - 1]

    const daysSinceFirst = differenceInDays(
      new Date(lastLog.injection_date),
      new Date(firstLog.injection_date)
    )

    const expectedInjections = Math.floor(daysSinceFirst / medication.frequency_days) + 1
    const actualInjections = logs.length

    return Math.min(Math.round((actualInjections / expectedInjections) * 100), 100)
  }

  const getAverageDaysBetween = () => {
    if (logs.length < 2) return 0

    let totalDays = 0
    for (let i = 1; i < logs.length; i++) {
      totalDays += differenceInDays(
        new Date(logs[i].injection_date),
        new Date(logs[i - 1].injection_date)
      )
    }

    return Math.round(totalDays / (logs.length - 1))
  }

  const getMonthlyData = () => {
    const monthCounts: { [key: string]: number } = {}

    logs.forEach((log) => {
      const monthKey = format(new Date(log.injection_date), 'MMM yyyy')
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    })

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      injections: count,
    }))
  }

  const getInjectionSiteData = () => {
    const siteCounts: { [key: string]: number } = {}

    logs.forEach((log) => {
      const site = log.injection_site.replace('_', ' ')
      siteCounts[site] = (siteCounts[site] || 0) + 1
    })

    return Object.entries(siteCounts).map(([site, count]) => ({
      name: site,
      value: count,
    }))
  }

  const adherence = calculateAdherence()
  const avgDays = getAverageDaysBetween()
  const monthlyData = getMonthlyData()
  const siteData = getInjectionSiteData()

  const COLORS = ['#00A1FE', '#51cf66', '#ff6b6b', '#ffd43b', '#a78bfa', '#f97316']

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Statistics" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="skeleton h-32 rounded-card" />
            <div className="skeleton h-64 rounded-card" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Statistics" />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-mm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-4 h-4" />
                <span className="text-sm">Adherence</span>
              </div>
              <p className="text-3xl font-heading text-primary">{adherence}%</p>
            </div>
          </div>

          <div className="card-mm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Total Logs</span>
              </div>
              <p className="text-3xl font-heading">{logs.length}</p>
            </div>
          </div>

          <div className="card-mm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Avg Days</span>
              </div>
              <p className="text-3xl font-heading">{avgDays}</p>
            </div>
          </div>

          <div className="card-mm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Sites Used</span>
              </div>
              <p className="text-3xl font-heading">{siteData.length}</p>
            </div>
          </div>
        </div>

        {monthlyData.length > 0 && (
          <div className="card-mm space-y-4">
            <h3 className="text-lg font-heading">Monthly Injections</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="injections" fill="#00A1FE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {siteData.length > 0 && (
          <div className="card-mm space-y-4">
            <h3 className="text-lg font-heading">Injection Site Distribution</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={siteData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {siteData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {siteData.map((site, index) => (
                <div key={site.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm capitalize">{site.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {site.value} injection{site.value !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
