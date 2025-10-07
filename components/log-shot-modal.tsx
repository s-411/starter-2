'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { INJECTION_SITES, type Medication } from '@/types'
import { X, Loader2, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface LogShotModalProps {
  isOpen: boolean
  onClose: () => void
  medication: Medication
  onSuccess: () => void
}

export function LogShotModal({
  isOpen,
  onClose,
  medication,
  onSuccess,
}: LogShotModalProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    injectionDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    dosage: medication.dosage.toString(),
    injectionSite: medication.preferred_injection_site || '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('injection_logs').insert({
        user_id: user.id,
        medication_id: medication.id,
        injection_date: new Date(formData.injectionDate).toISOString(),
        dosage: Number(formData.dosage),
        injection_site: formData.injectionSite,
        notes: formData.notes || null,
        is_completed: true,
      })

      if (insertError) throw insertError

      onSuccess()
      onClose()
      setFormData({
        injectionDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        dosage: medication.dosage.toString(),
        injectionSite: medication.preferred_injection_site || '',
        notes: '',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to log injection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogNow = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('injection_logs').insert({
        user_id: user.id,
        medication_id: medication.id,
        injection_date: new Date().toISOString(),
        dosage: medication.dosage,
        injection_site: medication.preferred_injection_site || 'abdomen',
        notes: null,
        is_completed: true,
      })

      if (insertError) throw insertError

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to log injection')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log Injection</h2>
          <button onClick={onClose} className="modal-close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.injectionDate}
              onChange={(e) =>
                setFormData({ ...formData, injectionDate: e.target.value })
              }
              className="input-mm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dosage</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                className="input-mm flex-1"
                min="0"
                step="0.01"
                required
              />
              <span className="text-sm text-muted-foreground">
                {medication.unit}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Injection Site</label>
            <select
              value={formData.injectionSite}
              onChange={(e) =>
                setFormData({ ...formData, injectionSite: e.target.value })
              }
              className="select-mm"
              required
            >
              <option value="">Select site</option>
              {INJECTION_SITES.map((site) => (
                <option key={site.id} value={site.name}>
                  {site.display}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="input-mm resize-none"
              rows={3}
              placeholder="Any observations or side effects..."
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleLogNow}
              disabled={isLoading}
              className="btn-mm w-full"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  Log Now ({medication.dosage} {medication.unit})
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              Log with Custom Details
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
