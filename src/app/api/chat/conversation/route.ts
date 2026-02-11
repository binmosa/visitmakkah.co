/**
 * Conversation API Route
 *
 * Manages chat topics and conversation history.
 * - POST: Create a new topic
 * - GET: Load conversation history for a topic
 */

import { NextRequest } from 'next/server'
import {
  createTopic,
  getTopicMessages,
  getRecentTopics,
  getOrCreateAnonymousVisitor,
} from '@/lib/chat-service'

// POST: Create a new chat topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contextAction, contextLabel, deviceId } = body

    if (!contextAction) {
      return new Response(
        JSON.stringify({ error: 'contextAction is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get or create anonymous visitor
    let anonymousId: string | null = null
    if (deviceId) {
      anonymousId = await getOrCreateAnonymousVisitor(deviceId)
    }

    // Create the topic
    const topic = await createTopic({
      context: contextAction,
      contextLabel,
      anonymousId: anonymousId || undefined,
    })

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Failed to create topic' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify({ topic }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating topic:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create topic' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// GET: Load conversation history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topicId = searchParams.get('topicId')
  const contextAction = searchParams.get('contextAction')
  const deviceId = searchParams.get('deviceId')

  try {
    // If topicId is provided, get messages for that topic
    if (topicId) {
      const messages = await getTopicMessages(topicId)
      return new Response(
        JSON.stringify({
          messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at,
          })),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // If contextAction and deviceId are provided, find the most recent topic for this context
    if (contextAction && deviceId) {
      const anonymousId = await getOrCreateAnonymousVisitor(deviceId)
      if (anonymousId) {
        const topics = await getRecentTopics({ anonymousId, limit: 10 })
        const matchingTopic = topics.find((t) => t.context === contextAction)

        if (matchingTopic) {
          const messages = await getTopicMessages(matchingTopic.id)
          return new Response(
            JSON.stringify({
              topicId: matchingTopic.id,
              messages: messages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                createdAt: m.created_at,
              })),
            }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // No conversation found
    return new Response(
      JSON.stringify({ messages: [], topicId: null }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error loading conversation:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to load conversation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
