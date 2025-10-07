'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import {
  User,
  Pill,
  Download,
  LogOut,
  ChevronRight,
  Loader2,
  FileText,
} from 'lucide-react'
import type { Profile, Medication, InjectionLog } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showMedication, setShowMedication] = useState(false)

  const [editProfile, setEditProfile] = useState({ full_name: '' })

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: medData } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (profileData) {
        setProfile(profileData)
        setEditProfile({ full_name: profileData.full_name || '' })
      }
      if (medData) setMedications(medData)
    } catch (error) {
      console.error('Error loading settings data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editProfile.full_name })
        .eq('id', profile.id)

      if (error) throw error

      setProfile({ ...profile, full_name: editProfile.full_name })
      setShowProfile(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: logs } = await supabase
        .from('injection_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('injection_date', { ascending: false })

      if (!logs) return

      const csvContent = [
        ['Date', 'Time', 'Medication', 'Dosage', 'Unit', 'Site', 'Notes'].join(','),
        ...logs.map((log) => {
          const medication = medications.find((m) => m.id === log.medication_id)
          const date = new Date(log.injection_date)
          return [
            date.toLocaleDateString(),
            date.toLocaleTimeString(),
            medication?.name || 'Unknown',
            log.dosage,
            medication?.unit || '',
            log.injection_site.replace('_', ' '),
            `"${log.notes || ''}"`,
          ].join(',')
        }),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `injection-history-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: logs } = await supabase
        .from('injection_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('injection_date', { ascending: false })

      if (!logs) return

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Injection History Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #00A1FE; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .header { margin-bottom: 30px; }
            .footer { margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Injection History Report</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
            <p>Patient: ${profile?.full_name || 'N/A'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Site</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
      `

      logs.forEach((log) => {
        const medication = medications.find((m) => m.id === log.medication_id)
        const date = new Date(log.injection_date)
        htmlContent += `
          <tr>
            <td>${date.toLocaleDateString()}</td>
            <td>${date.toLocaleTimeString()}</td>
            <td>${medication?.name || 'Unknown'}</td>
            <td>${log.dosage} ${medication?.unit || ''}</td>
            <td>${log.injection_site.replace('_', ' ')}</td>
            <td>${log.notes || '-'}</td>
          </tr>
        `
      })

      htmlContent += `
            </tbody>
          </table>
          <div class="footer">
            <p>This report contains ${logs.length} injection record${logs.length !== 1 ? 's' : ''}.</p>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `injection-report-${new Date().toISOString().split('T')[0]}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Settings" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="skeleton h-20 rounded-card" />
            <div className="skeleton h-20 rounded-card" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Settings" showNotifications={false} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="card-mm space-y-1">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-input transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Profile</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || 'Not set'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {showProfile && (
            <div className="p-4 space-y-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={editProfile.full_name}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, full_name: e.target.value })
                  }
                  className="input-mm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  className="input-mm"
                  disabled
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-mm w-full"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>

        <div className="card-mm space-y-1">
          <button
            onClick={() => setShowMedication(!showMedication)}
            className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-input transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Medications</p>
                <p className="text-sm text-muted-foreground">
                  {medications.length} active
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {showMedication && (
            <div className="p-4 space-y-2 border-t border-border">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-3 bg-muted rounded-input"
                >
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.dosage} {med.unit} • {med.frequency}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-mm space-y-2">
          <h3 className="text-lg font-heading px-3 pt-3">Export Data</h3>
          <p className="text-sm text-muted-foreground px-3 pb-2">
            Share your injection history with healthcare providers
          </p>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-input transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <span>Export as CSV</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-input transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Export as Report (HTML)</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="card-mm">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-3 text-destructive hover:bg-destructive/10 rounded-input transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
