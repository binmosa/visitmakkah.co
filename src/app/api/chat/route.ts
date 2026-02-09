/**
 * Chat API Route v2
 *
 * Main chat endpoint using Vercel AI SDK with OpenAI.
 * Features:
 * - Context-aware responses based on navigation action
 * - User profile personalization
 * - Two-stage flow: refinement check + main response
 * - Widget markers for rich UI rendering
 * - Supabase conversation persistence
 *
 * Required packages:
 *   npm install ai @ai-sdk/openai zod
 */

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getContextConfig } from '@/config/ai-context'
import { saveMessage, getConversationHistory } from '@/lib/chat-service'

// User profile from onboarding
interface UserProfile {
  journeyStage: string | null
  journeyType: string | null
  isFirstTime: boolean | null
  gender: string | null
  country: string | null
  travelGroup: string | null
  departureDate: string | null
  returnDate: string | null
  daysUntilDeparture: number | null
}

// Request body type
interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  contextAction: string
  userProfile?: UserProfile
  topicId?: string
}

// Build comprehensive system prompt
function buildSystemPrompt(contextAction: string, userProfile?: UserProfile): string {
  const config = getContextConfig(contextAction)

  let prompt = `You are a helpful AI assistant for Visit Makkah, specializing in Umrah and Hajj pilgrimage guidance.

## Your Role
- Provide accurate, respectful guidance on Islamic pilgrimage
- Be culturally sensitive and knowledgeable about Islamic practices
- Give practical, actionable advice for travelers
- Always maintain a warm, supportive tone

## Current Context
The user is on the "${config.actionLabel}" page.
- Primary knowledge domain: ${config.action}
- Suggested widget type: ${config.primaryWidget}

${config.systemPromptAddition}

## Important Guidelines
1. You can query multiple knowledge bases if the user's question spans different topics
2. You can render multiple widgets in a single response if helpful
3. Always cite sources when providing information from the knowledge base
4. Be sensitive to different Islamic schools of thought (madhabs)
5. Provide both Arabic text and transliterations for duas and prayers
6. Keep responses concise but thorough

## Widget Format
When providing structured data that benefits from visual presentation, use this exact format:

<<<WIDGET:type>>>
{
  "key": "value"
}
<<<END_WIDGET>>>

Available widget types:
- itinerary: Multi-day travel plans with activities
- checklist: Interactive checklists with categories
- budget: Cost breakdowns with totals
- guide: Step-by-step instructional guides
- dua: Prayers with Arabic, transliteration, translation
- ritual: Ritual instructions with steps and duas
- places: Location cards (hotels, restaurants, landmarks)
- crowd: Crowd level indicators and forecasts
- navigation: Directions and routes
- tips: Tips and advice cards

**Widget Usage Rules:**
- Only use widgets when they genuinely improve the response
- Simple text answers don't need widgets
- You can include multiple widgets in one response
- Always include explanatory text around widgets
- Ensure JSON is valid and complete
`

  // Add user personalization
  if (userProfile) {
    prompt += `\n## User Profile\n`

    if (userProfile.journeyType) {
      prompt += `- Journey type: ${userProfile.journeyType}\n`
    }
    if (userProfile.isFirstTime !== null) {
      prompt += `- First time pilgrim: ${userProfile.isFirstTime ? 'Yes' : 'No'}\n`
    }
    if (userProfile.gender) {
      prompt += `- Gender: ${userProfile.gender}\n`
    }
    if (userProfile.country) {
      prompt += `- Country: ${userProfile.country}\n`
    }
    if (userProfile.travelGroup) {
      prompt += `- Traveling: ${userProfile.travelGroup}\n`
    }
    if (userProfile.departureDate) {
      prompt += `- Departure date: ${userProfile.departureDate}\n`
    }
    if (userProfile.daysUntilDeparture !== null && userProfile.daysUntilDeparture > 0) {
      prompt += `- Days until departure: ${userProfile.daysUntilDeparture}\n`
    }

    prompt += `\nPersonalize your responses based on this profile:
- First-timers need more detailed explanations
- Women may need specific guidance on dress code and designated areas
- Consider the user's country for visa and travel requirements
- Adjust urgency based on how soon they're traveling\n`
  }

  return prompt
}

// Check if question needs refinement (Stage 1)
function checkNeedsRefinement(
  messages: ChatRequest['messages'],
  contextAction: string
): string | null {
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role !== 'user') return null

  const userQuestion = lastMessage.content.toLowerCase().trim()

  // Skip refinement for longer, well-formed questions
  if (userQuestion.length > 30) return null
  if (userQuestion.includes('?') && userQuestion.length > 15) return null

  // Patterns that need refinement
  const refinementPatterns: Array<{ pattern: RegExp; response: string }> = [
    {
      pattern: /^(umrah|hajj)(\s+plan)?$/i,
      response: `I'd love to help you plan your ${userQuestion.includes('hajj') ? 'Hajj' : 'Umrah'}! To create a personalized plan, could you tell me:

1. How many days/nights are you planning to stay?
2. Are you traveling alone, with family, or in a group?
3. Is this your first time?`,
    },
    {
      pattern: /^(hotel|hotels|accommodation|where to stay)$/i,
      response: `I can help you find the perfect accommodation! To give you the best recommendations:

1. What's your budget range (economy, mid-range, or luxury)?
2. How important is walking distance to Haram?
3. Do you need any specific amenities (family rooms, wheelchair access, etc.)?`,
    },
    {
      pattern: /^(visa|visa guide|get visa)$/i,
      response: `I'll help you with visa information! To provide accurate guidance, which country will you be applying from?`,
    },
    {
      pattern: /^(pack|packing|what to pack)$/i,
      response: `I'll help you prepare a comprehensive packing list! A few questions:

1. Are you going for Umrah or Hajj?
2. What month are you traveling?
3. Are you male or female? (for appropriate Ihram/clothing recommendations)`,
    },
    {
      pattern: /^(budget|cost|how much)$/i,
      response: `I can help you estimate your pilgrimage budget! To give you an accurate breakdown:

1. Are you planning Umrah or Hajj?
2. How many days will you be staying?
3. What's your preferred accommodation level (economy, mid-range, or luxury)?`,
    },
  ]

  for (const { pattern, response } of refinementPatterns) {
    if (pattern.test(userQuestion)) {
      return response
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest
    const { messages, contextAction = 'general', userProfile, topicId } = body

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stage 1: Check if refinement is needed
    const refinementQuestion = checkNeedsRefinement(messages, contextAction)
    if (refinementQuestion) {
      // Return refinement as a simple non-streaming response
      return new Response(
        JSON.stringify({
          role: 'assistant',
          content: refinementQuestion,
          isRefinement: true,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Load conversation history if topic exists
    let conversationHistory = messages
    if (topicId) {
      try {
        const history = await getConversationHistory(topicId)
        if (history.length > 0) {
          conversationHistory = history
        }
      } catch (e) {
        console.warn('Failed to load conversation history:', e)
      }
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(contextAction, userProfile)

    // Stage 2: Main AI response with streaming
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: conversationHistory,
      temperature: 0.7,
      maxOutputTokens: 4000,
      // Tools will be added when RAG is integrated
      onFinish: async ({ text }) => {
        // Save to Supabase (non-blocking)
        if (topicId) {
          const lastUserMessage = messages[messages.length - 1]
          if (lastUserMessage?.role === 'user') {
            try {
              await saveMessage(topicId, 'user', lastUserMessage.content)
              await saveMessage(topicId, 'assistant', text)
            } catch (e) {
              console.error('Failed to save messages:', e)
            }
          }
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      version: '2.0',
      features: ['streaming', 'widgets', 'refinement', 'personalization'],
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
