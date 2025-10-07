import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          // @ts-ignore - TypeScript has issues with Supabase's complex generic type inference
          .eq('id', user.id)
          .limit(1)

        const profile = profiles?.[0]

        if (!profile) {
          // @ts-ignore - TypeScript has issues with Supabase's complex generic type inference
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email!,
          })

          return NextResponse.redirect(`${origin}/onboarding`)
        }

        const { data: medications } = await supabase
          .from('medications')
          .select('*')
          // @ts-ignore - TypeScript has issues with Supabase's complex generic type inference
          .eq('user_id', user.id)
          // @ts-ignore - TypeScript has issues with Supabase's complex generic type inference
          .eq('is_active', true)
          .limit(1)

        if (!medications || medications.length === 0) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}
