export interface InjectionSite {
  id: string
  name: string
  display: string
}

export const INJECTION_SITES: InjectionSite[] = [
  { id: 'left_arm', name: 'left_arm', display: 'Left Arm' },
  { id: 'right_arm', name: 'right_arm', display: 'Right Arm' },
  { id: 'left_thigh', name: 'left_thigh', display: 'Left Thigh' },
  { id: 'right_thigh', name: 'right_thigh', display: 'Right Thigh' },
  { id: 'abdomen', name: 'abdomen', display: 'Abdomen' },
  { id: 'other', name: 'other', display: 'Other' },
]

export const MEDICATION_UNITS = ['mg', 'mL', 'IU', 'mcg'] as const
export type MedicationUnit = typeof MEDICATION_UNITS[number]

export const FREQUENCIES = [
  { id: 'daily', label: 'Daily', days: 1 },
  { id: 'every_other_day', label: 'Every Other Day', days: 2 },
  { id: 'twice_weekly', label: 'Twice Weekly', days: 3.5 },
  { id: 'weekly', label: 'Weekly', days: 7 },
  { id: 'biweekly', label: 'Bi-weekly', days: 14 },
  { id: 'monthly', label: 'Monthly', days: 30 },
  { id: 'custom', label: 'Custom', days: 0 },
] as const

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: number
  unit: string
  frequency: string
  frequency_days: number
  preferred_injection_site: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InjectionLog {
  id: string
  user_id: string
  medication_id: string
  injection_date: string
  dosage: number
  injection_site: string
  notes: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  user_id: string
  medication_id: string
  reminder_time: string
  hours_before: number
  is_active: boolean
  created_at: string
  updated_at: string
}
