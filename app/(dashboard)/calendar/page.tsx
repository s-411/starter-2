'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import type { InjectionLog, Medication } from '@/types'

export default function CalendarPage() {
  const supabase = createClient()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [logs, setLogs] = useState<InjectionLog[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)

      const { data: logData } = await supabase
        .from('injection_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('injection_date', monthStart.toISOString())
        .lte('injection_date', monthEnd.toISOString())
        .order('injection_date', { ascending: false })

      const { data: medData } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (logData) setLogs(logData)
      if (medData) setMedications(medData)
    } catch (error) {
      console.error('Error loading calendar data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentDate])

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    return eachDayOfInterval({ start, end })
  }

  const getLogsForDate = (date: Date) => {
    return logs.filter((log) =>
      isSameDay(new Date(log.injection_date), date)
    )
  }

  const getDayStatus = (date: Date) => {
    const dayLogs = getLogsForDate(date)
    if (dayLogs.length > 0) return 'completed'
    return null
  }

  const days = getDaysInMonth()
  const selectedDateLogs = selectedDate ? getLogsForDate(selectedDate) : []

  return (
    <div className="min-h-screen">
      <Header title="Calendar" />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="card-mm space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-accent rounded-input transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-heading">
              {format(currentDate, 'MMMM yyyy')}
            </h2>

            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-accent rounded-input transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}

            {days.map((day) => {
              const status = getDayStatus(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-1 rounded-input text-sm transition-colors
                    ${!isCurrentMonth ? 'text-muted-foreground opacity-30' : ''}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                    ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{format(day, 'd')}</span>
                    {status === 'completed' && (
                      <Circle className="w-2 h-2 fill-primary text-primary mt-1" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 text-sm pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-primary text-primary" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 ring-2 ring-primary rounded-full" />
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="card-mm space-y-4">
            <h3 className="text-lg font-heading">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            {selectedDateLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No injections logged for this date
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateLogs.map((log) => {
                  const medication = medications.find((m) => m.id === log.medication_id)

                  return (
                    <div
                      key={log.id}
                      className="p-4 bg-muted rounded-input space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {medication?.name || 'Unknown Medication'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {log.dosage} {medication?.unit} • {log.injection_site.replace('_', ' ')}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(log.injection_date), 'h:mm a')}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-sm text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
