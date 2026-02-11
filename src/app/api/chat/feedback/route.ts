// @ts-nocheck - Table may not exist yet
import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, contextAction, feedback } = body

    if (!messageId || !contextAction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store feedback in Supabase (table: ai_feedback)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ai_feedback').upsert(
          {
            message_id: messageId,
            context_action: contextAction,
            feedback: feedback, // 'positive', 'negative', or null
            created_at: new Date().toISOString(),
          },
          {
            onConflict: 'message_id',
          }
        )
      } catch (dbError) {
        // Table may not exist - silently fail
        console.warn('Feedback table not configured:', dbError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
}
