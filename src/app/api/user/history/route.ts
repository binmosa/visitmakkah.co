/**
 * User History API
 *
 * Returns recent conversation history for the user.
 * GET: Fetch recent conversations with preview
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export interface ConversationPreview {
  id: string
  context: string
  contextLabel: string | null
  startedAt: string
  messageCount: number
  lastMessage: string | null
  lastMessageAt: string | null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get('deviceId')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!deviceId) {
    return new Response(
      JSON.stringify({ error: 'deviceId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabase = getSupabaseAdmin()

    // First get the anonymous visitor ID
    const { data: visitor } = await supabase
      .from('anonymous_visitors')
      .select('id')
      .eq('device_id', deviceId)
      .single()

    if (!visitor) {
      return new Response(
        JSON.stringify({ conversations: [] }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get recent topics with last message preview
    const { data: topics, error } = await supabase
      .from('chat_topics')
      .select(`
        id,
        context,
        context_label,
        started_at,
        message_count
      `)
      .eq('anonymous_id', visitor.id)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching history:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch history' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get last message for each topic
    const conversations: ConversationPreview[] = await Promise.all(
      (topics || []).map(async (topic) => {
        const { data: lastMsg } = await supabase
          .from('chat_messages')
          .select('content, created_at')
          .eq('topic_id', topic.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          id: topic.id,
          context: topic.context,
          contextLabel: topic.context_label,
          startedAt: topic.started_at,
          messageCount: topic.message_count,
          lastMessage: lastMsg?.content?.substring(0, 100) || null,
          lastMessageAt: lastMsg?.created_at || null,
        }
      })
    )

    return new Response(
      JSON.stringify({ conversations }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('History API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch history' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
