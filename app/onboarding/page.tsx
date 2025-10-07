'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { INJECTION_SITES, MEDICATION_UNITS, FREQUENCIES } from '@/types'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    medicationName: '',
    dosage: '',
    unit: 'mg' as const,
    frequency: 'weekly',
    frequencyDays: 7,
    preferredSite: '',
  })

  const handleNext = () => {
    setError(null)
    if (step === 1 && !formData.fullName.trim()) {
      setError('Please enter your name')
      return
    }
    if (step === 2 && !formData.medicationName.trim()) {
      setError('Please enter medication name')
      return
    }
    if (step === 3 && (!formData.dosage || Number(formData.dosage) <= 0)) {
      setError('Please enter a valid dosage')
      return
    }
    if (step === 4) {
      handleSubmit()
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await supabase
        .from('profiles')
        .update({ full_name: formData.fullName })
        .eq('id', user.id)

      const { data: medication, error: medError } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: formData.medicationName,
          dosage: Number(formData.dosage),
          unit: formData.unit,
          frequency: formData.frequency,
          frequency_days: formData.frequencyDays,
          preferred_injection_site: formData.preferredSite || null,
        })
        .select()
        .single()

      if (medError) throw medError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="card-mm w-full max-w-md space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-heading">Welcome!</h2>
                <p className="text-muted-foreground">
                  Let&apos;s get you set up. What&apos;s your name?
                </p>
              </div>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input-mm"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-heading">Your Medication</h2>
                <p className="text-muted-foreground">
                  What peptide are you tracking?
                </p>
              </div>
              <input
                type="text"
                placeholder="e.g., Semaglutide, Tirzepatide"
                value={formData.medicationName}
                onChange={(e) =>
                  setFormData({ ...formData, medicationName: e.target.value })
                }
                className="input-mm"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-heading">Dosage</h2>
                <p className="text-muted-foreground">
                  How much do you inject each time?
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  className="input-mm flex-1"
                  min="0"
                  step="0.01"
                  autoFocus
                />
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit: e.target.value as typeof formData.unit,
                    })
                  }
                  className="select-mm w-24"
                >
                  {MEDICATION_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => {
                    const freq = FREQUENCIES.find((f) => f.id === e.target.value)
                    setFormData({
                      ...formData,
                      frequency: e.target.value,
                      frequencyDays: freq?.days || 7,
                    })
                  }}
                  className="select-mm"
                >
                  {FREQUENCIES.filter((f) => f.id !== 'custom').map((freq) => (
                    <option key={freq.id} value={freq.id}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-heading">Injection Site</h2>
                <p className="text-muted-foreground">
                  Do you have a preferred injection site? (Optional)
                </p>
              </div>
              <select
                value={formData.preferredSite}
                onChange={(e) =>
                  setFormData({ ...formData, preferredSite: e.target.value })
                }
                className="select-mm"
              >
                <option value="">No preference</option>
                {INJECTION_SITES.map((site) => (
                  <option key={site.id} value={site.name}>
                    {site.display}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="text-error text-sm">{error}</div>}
        </div>

        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="btn-mm flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </>
            ) : step === 4 ? (
              'Complete Setup'
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
