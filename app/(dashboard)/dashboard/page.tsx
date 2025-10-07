'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { LogShotModal } from '@/components/log-shot-modal'
import { Plus, Calendar as CalendarIcon, TrendingUp, Syringe } from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import type { Medication, InjectionLog } from '@/types'

export default function DashboardPage() {
  const supabase = createClient()
  const [medications, setMedications] = useState<Medication[]>([])
  const [recentLogs, setRecentLogs] = useState<InjectionLog[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: meds } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (meds) {
        setMedications(meds)
        if (meds.length > 0 && !selectedMedication) {
          setSelectedMedication(meds[0])
        }
      }

      const { data: logs } = await supabase
        .from('injection_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('injection_date', { ascending: false })
        .limit(5)

      if (logs) setRecentLogs(logs)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, selectedMedication])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getNextDueDate = () => {
    if (!selectedMedication || recentLogs.length === 0) return null

    const lastLog = recentLogs[0]
    return addDays(new Date(lastLog.injection_date), selectedMedication.frequency_days)
  }

  const getDaysUntilNext = () => {
    const nextDate = getNextDueDate()
    if (!nextDate) return null

    return differenceInDays(nextDate, new Date())
  }

  const handleLogSuccess = () => {
    loadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="skeleton h-32 rounded-card" />
            <div className="skeleton h-48 rounded-card" />
          </div>
        </div>
      </div>
    )
  }

  if (medications.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="card-mm text-center space-y-4">
            <Syringe className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-heading">No Medications Set Up</h2>
            <p className="text-muted-foreground">
              Add your first medication to start tracking injections
            </p>
          </div>
        </div>
      </div>
    )
  }

  const daysUntilNext = getDaysUntilNext()
  const isOverdue = daysUntilNext !== null && daysUntilNext < 0

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {selectedMedication && (
          <>
            <div className="card-mm">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-heading">
                      {selectedMedication.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedMedication.dosage} {selectedMedication.unit}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-input">
                    {FREQUENCY_LABELS[selectedMedication.frequency as keyof typeof FREQUENCY_LABELS] || selectedMedication.frequency}
                  </span>
                </div>

                {daysUntilNext !== null && (
                  <div
                    className={`p-4 rounded-input ${
                      isOverdue
                        ? 'bg-destructive/10 border border-destructive'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span className="font-medium">
                        {isOverdue
                          ? `Overdue by ${Math.abs(daysUntilNext)} day${Math.abs(daysUntilNext) !== 1 ? 's' : ''}`
                          : daysUntilNext === 0
                          ? 'Due today'
                          : `Next injection in ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-mm w-full"
                >
                  <Plus className="w-5 h-5" />
                  Log Injection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card-mm">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Logs</p>
                  <p className="text-3xl font-heading">{recentLogs.length}</p>
                </div>
              </div>

              <div className="card-mm">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-3xl font-heading">
                    {
                      recentLogs.filter(
                        (log) =>
                          differenceInDays(new Date(), new Date(log.injection_date)) <= 7
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="card-mm space-y-4">
          <h3 className="text-xl font-heading">Recent Injections</h3>

          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Syringe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No injections logged yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-input"
                >
                  <div>
                    <p className="font-medium">
                      {log.dosage}{' '}
                      {medications.find((m) => m.id === log.medication_id)?.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.injection_site.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {format(new Date(log.injection_date), 'MMM d')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.injection_date), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedMedication && (
        <LogShotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medication={selectedMedication}
          onSuccess={handleLogSuccess}
        />
      )}
    </div>
  )
}

const FREQUENCY_LABELS = {
  daily: 'Daily',
  every_other_day: 'Every Other Day',
  twice_weekly: 'Twice Weekly',
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
}
