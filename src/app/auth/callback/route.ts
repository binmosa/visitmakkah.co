import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
            const supabase = createClient(supabaseUrl, supabaseAnonKey)

            // Exchange the code for a session
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Auth callback error:', error)
                // Redirect to login with error
                return NextResponse.redirect(
                    new URL('/login?error=auth_error', requestUrl.origin)
                )
            }
        }
    }

    // Redirect to dashboard after successful auth
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
