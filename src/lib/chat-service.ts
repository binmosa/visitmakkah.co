/**
 * Chat Service
 *
 * Handles Supabase operations for chat persistence.
 * Uses existing schema: chat_topics, chat_messages, popular_questions
 */

import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (uses service role key)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Types matching the database schema
export interface ChatTopic {
  id: string
  profile_id?: string | null
  anonymous_id?: string | null
  context: string
  context_label?: string
  started_at: string
  ended_at?: string | null
  message_count: number
  user_rating?: number | null
  was_helpful?: boolean | null
  feedback_text?: string | null
}

export interface ChatMessage {
  id: string
  topic_id: string
  role: 'user' | 'assistant'
  content: string
  context?: string | null
  was_edited: boolean
  thumbs_up?: boolean | null
  created_at: string
}

/**
 * Create a new chat topic
 */
export async function createTopic(params: {
  context: string
  contextLabel?: string
  profileId?: string
  anonymousId?: string
}): Promise<ChatTopic | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('chat_topics')
      .insert({
        context: params.context,
        context_label: params.contextLabel,
        profile_id: params.profileId || null,
        anonymous_id: params.anonymousId || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating topic:', error)
      return null
    }

    return data
  } catch (e) {
    console.error('Error creating topic:', e)
    return null
  }
}

/**
 * Save a message to a topic
 */
export async function saveMessage(
  topicId: string,
  role: 'user' | 'assistant',
  content: string,
  context?: string
): Promise<ChatMessage | null> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        topic_id: topicId,
        role,
        content,
        context: context || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving message:', error)
      return null
    }

    // If this is a user message, track it for popular questions
    if (role === 'user' && context) {
      await trackPopularQuestion(content, context)
    }

    return data
  } catch (e) {
    console.error('Error saving message:', e)
    return null
  }
}

/**
 * Get conversation history for a topic
 */
export async function getConversationHistory(
  topicId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching history:', error)
      return []
    }

    return (data || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))
  } catch (e) {
    console.error('Error fetching history:', e)
    return []
  }
}

/**
 * Get all messages for a topic (with full metadata)
 */
export async function getTopicMessages(topicId: string): Promise<ChatMessage[]> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Error fetching messages:', e)
    return []
  }
}

/**
 * Update topic with feedback
 */
export async function updateTopicFeedback(
  topicId: string,
  feedback: {
    userRating?: number
    wasHelpful?: boolean
    feedbackText?: string
  }
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('chat_topics')
      .update({
        user_rating: feedback.userRating,
        was_helpful: feedback.wasHelpful,
        feedback_text: feedback.feedbackText,
        ended_at: new Date().toISOString(),
      })
      .eq('id', topicId)

    if (error) {
      console.error('Error updating topic:', error)
      return false
    }

    return true
  } catch (e) {
    console.error('Error updating topic:', e)
    return false
  }
}

/**
 * Rate a specific message
 */
export async function rateMessage(
  messageId: string,
  thumbsUp: boolean
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('chat_messages')
      .update({ thumbs_up: thumbsUp })
      .eq('id', messageId)

    if (error) {
      console.error('Error rating message:', error)
      return false
    }

    return true
  } catch (e) {
    console.error('Error rating message:', e)
    return false
  }
}

/**
 * Track popular questions (upsert pattern)
 */
async function trackPopularQuestion(
  question: string,
  context: string
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()

    // Normalize the question
    const normalizedQuestion = question.trim().toLowerCase()

    // Skip very short questions or common greetings
    if (normalizedQuestion.length < 10) return
    if (['hi', 'hello', 'hey', 'thanks', 'thank you'].includes(normalizedQuestion)) return

    // Try to upsert
    const { error } = await supabase.rpc('upsert_popular_question', {
      p_question: question.trim(),
      p_context: context,
    })

    if (error) {
      // If RPC doesn't exist, try manual upsert
      const { data: existing } = await supabase
        .from('popular_questions')
        .select('id, ask_count')
        .eq('question', question.trim())
        .eq('context', context)
        .single()

      if (existing) {
        await supabase
          .from('popular_questions')
          .update({
            ask_count: existing.ask_count + 1,
            last_asked: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('popular_questions').insert({
          question: question.trim(),
          context,
          ask_count: 1,
        })
      }
    }
  } catch (e) {
    // Non-critical, log and continue
    console.warn('Error tracking popular question:', e)
  }
}

/**
 * Get popular questions for a context (for suggested prompts)
 */
export async function getPopularQuestions(
  context: string,
  limit = 5
): Promise<string[]> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('popular_questions')
      .select('question')
      .eq('context', context)
      .eq('is_featured', true)
      .order('ask_count', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular questions:', error)
      return []
    }

    return (data || []).map((q) => q.question)
  } catch (e) {
    console.error('Error fetching popular questions:', e)
    return []
  }
}

/**
 * Get or create anonymous visitor
 */
export async function getOrCreateAnonymousVisitor(
  deviceId: string
): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin()

    // Try to find existing
    const { data: existing } = await supabase
      .from('anonymous_visitors')
      .select('id')
      .eq('device_id', deviceId)
      .single()

    if (existing) {
      // Update last seen
      await supabase
        .from('anonymous_visitors')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', existing.id)

      return existing.id
    }

    // Create new
    const { data: created, error } = await supabase
      .from('anonymous_visitors')
      .insert({ device_id: deviceId })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating anonymous visitor:', error)
      return null
    }

    return created.id
  } catch (e) {
    console.error('Error with anonymous visitor:', e)
    return null
  }
}

/**
 * Get recent topics for a user/visitor
 */
export async function getRecentTopics(params: {
  profileId?: string
  anonymousId?: string
  limit?: number
}): Promise<ChatTopic[]> {
  try {
    const supabase = getSupabaseAdmin()

    let query = supabase
      .from('chat_topics')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(params.limit || 10)

    if (params.profileId) {
      query = query.eq('profile_id', params.profileId)
    } else if (params.anonymousId) {
      query = query.eq('anonymous_id', params.anonymousId)
    } else {
      return []
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching recent topics:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('Error fetching recent topics:', e)
    return []
  }
}
