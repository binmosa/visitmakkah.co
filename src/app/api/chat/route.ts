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
1. Use the knowledge tool to search for accurate information before answering
2. If no relevant information is retrieved from the knowledge base, say you are unsure instead of guessing
3. You can render multiple widgets in a single response if helpful
4. Always cite sources when providing information from the knowledge base
5. Be sensitive to different Islamic schools of thought (madhabs)
6. Provide both Arabic text and transliterations for duas and prayers
7. Keep responses concise but thorough

## Widget Format
When providing structured data, use this EXACT format with the specific JSON schemas shown:

**Format:**
\`\`\`
<<<WIDGET:type>>>
{JSON data here}
<<<END_WIDGET>>>
\`\`\`

**IMPORTANT: You MUST use widgets for structured responses. Here are the schemas:**

### 1. tips - For advice and tips (USE THIS OFTEN)
<<<WIDGET:tips>>>
{"title":"Essential Tips","description":"Key advice for pilgrims","audience":"all","tips":[{"title":"Stay Hydrated","content":"Drink plenty of water, especially during Tawaf.","icon":"💧","priority":"must-know","category":"Health"},{"title":"Comfortable Footwear","content":"Wear comfortable shoes as you'll walk a lot.","icon":"👟","priority":"helpful"}]}
<<<END_WIDGET>>>

### 2. checklist - For packing lists or task lists
<<<WIDGET:checklist>>>
{"title":"Umrah Packing Checklist","description":"Essential items to pack","categories":[{"name":"Documents","icon":"📄","items":[{"text":"Passport (valid 6+ months)","required":true,"checked":false},{"text":"Visa printout","required":true,"checked":false}]},{"name":"Clothing","icon":"👔","items":[{"text":"Ihram (2 white cloths for men)","required":true,"checked":false}]}]}
<<<END_WIDGET>>>

### 3. guide - For step-by-step instructions
<<<WIDGET:guide>>>
{"title":"How to Perform Tawaf","description":"Complete guide to circumambulating the Kaaba","difficulty":"beginner","estimatedTime":"45-60 minutes","steps":[{"stepNumber":1,"title":"Start at Black Stone","description":"Begin at the corner with the Black Stone (Hajar al-Aswad)","tips":["Face the Kaaba with it on your left"]},{"stepNumber":2,"title":"Make Intention","description":"Make niyyah (intention) for Tawaf"}]}
<<<END_WIDGET>>>

### 4. dua - For prayers and supplications
<<<WIDGET:dua>>>
{"title":"Dua When Seeing the Kaaba","occasion":"First sight of the Kaaba","arabic":"اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا","transliteration":"Allahumma zid hadha al-bayta tashrifan wa ta'zeeman","translation":"O Allah, increase this House in honor and reverence","source":"Hadith","notes":"Recite this dua when you first see the Kaaba"}
<<<END_WIDGET>>>

### 5. itinerary - For travel plans
<<<WIDGET:itinerary>>>
{"title":"5-Day Umrah Itinerary","description":"A complete plan for your pilgrimage","totalDays":5,"days":[{"dayNumber":1,"title":"Arrival Day","date":"Day 1","activities":[{"time":"Morning","title":"Arrive in Jeddah","description":"Land at King Abdulaziz Airport","type":"travel","location":"Jeddah Airport"},{"time":"Afternoon","title":"Travel to Makkah","description":"Take transport to your hotel","type":"travel"}]}]}
<<<END_WIDGET>>>

### 6. budget - For cost breakdowns
<<<WIDGET:budget>>>
{"title":"Umrah Budget Estimate","description":"Approximate costs for a 7-day trip","currency":"USD","total":2500,"breakdown":[{"category":"Flights","amount":800,"description":"Round-trip airfare"},{"category":"Accommodation","amount":700,"description":"7 nights near Haram"}],"notes":"Prices vary by season and booking time"}
<<<END_WIDGET>>>

### 7. places - For hotels, restaurants, landmarks
<<<WIDGET:places>>>
{"title":"Hotels Near Haram","description":"Recommended accommodations","places":[{"name":"Hilton Suites Makkah","arabicName":"هيلتون سويتس مكة","category":"hotel","description":"5-star hotel with Kaaba views","location":{"area":"Ajyad","distanceToHaram":"200m"},"rating":4.5,"priceRange":"$$$","amenities":["Kaaba View","Restaurant","WiFi"]}]}
<<<END_WIDGET>>>

### 8. ritual - For religious rituals with steps
<<<WIDGET:ritual>>>
{"title":"How to Perform Sa'i","ritualName":"Sa'i","description":"Walking between Safa and Marwa","steps":[{"stepNumber":1,"title":"Start at Safa","arabicTitle":"الصفا","description":"Begin at Mount Safa facing the Kaaba","dua":{"arabic":"إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ","transliteration":"Innas-Safa wal-Marwata min sha'a'irillah","translation":"Indeed, Safa and Marwa are among the symbols of Allah"}}]}
<<<END_WIDGET>>>

**Widget Usage Rules:**
- USE WIDGETS for lists, steps, tips, duas, places - they make content much clearer
- Always include explanatory text before/after widgets
- Ensure JSON is valid (no trailing commas, proper quotes)
- Match the exact field names shown in examples above
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

    // Stage 2: Main AI response with streaming (with RAG via file_search)
    const result = streamText({
      model: openai.responses('gpt-4o'),
      system: systemPrompt,
      messages: conversationHistory,
      temperature: 0.7,
      maxOutputTokens: 4000,
      tools: {
        knowledge: openai.tools.fileSearch({
          vectorStoreIds: [process.env.OPENAI_VECTOR_STORE_MAIN!],
          maxNumResults: 10,
        }),
      },
      toolChoice: 'auto',
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
