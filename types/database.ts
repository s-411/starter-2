export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          updated_at?: string
        }
      }
      medications: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: number
          unit: string
          frequency: string
          frequency_days: number
          preferred_injection_site?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: number
          unit?: string
          frequency?: string
          frequency_days?: number
          preferred_injection_site?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      injection_logs: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          medication_id: string
          injection_date: string
          dosage: number
          injection_site: string
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_id?: string
          injection_date?: string
          dosage?: number
          injection_site?: string
          notes?: string | null
          is_completed?: boolean
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          medication_id: string
          reminder_time: string
          hours_before: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_id: string
          reminder_time: string
          hours_before: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_id?: string
          reminder_time?: string
          hours_before?: number
          is_active?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
