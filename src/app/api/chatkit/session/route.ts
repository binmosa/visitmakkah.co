import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// Agent IDs mapped to context - you'll replace these with your actual agent IDs from Agent Builder
const AGENT_IDS: Record<string, string> = {
    // Your Journey
    'hajj': process.env.AGENT_ID_HAJJ || '',
    'umrah': process.env.AGENT_ID_UMRAH || '',
    'rituals': process.env.AGENT_ID_RITUALS || '',
    'spiritual': process.env.AGENT_ID_SPIRITUAL || '',
    // Plan
    'plan': process.env.AGENT_ID_PLAN || '',
    'timeline-builder': process.env.AGENT_ID_PLAN || '',
    'visa-steps': process.env.AGENT_ID_PLAN || '',
    'packing': process.env.AGENT_ID_PLAN || '',
    'transport': process.env.AGENT_ID_PLAN || '',
    // Stay & Food
    'stay-and-food': process.env.AGENT_ID_STAY_FOOD || '',
    'hotels': process.env.AGENT_ID_STAY_FOOD || '',
    'restaurants': process.env.AGENT_ID_STAY_FOOD || '',
    'women-friendly': process.env.AGENT_ID_STAY_FOOD || '',
    'late-night': process.env.AGENT_ID_STAY_FOOD || '',
    // Smart Tools
    'smart-tools': process.env.AGENT_ID_TOOLS || '',
    'trip-planner': process.env.AGENT_ID_TOOLS || '',
    'budget-tool': process.env.AGENT_ID_TOOLS || '',
    'packing-list': process.env.AGENT_ID_TOOLS || '',
    'distance-calculator': process.env.AGENT_ID_TOOLS || '',
    // Local Tips
    'local-tips': process.env.AGENT_ID_TIPS || '',
    'seasonal-hacks': process.env.AGENT_ID_TIPS || '',
    'ramadan-advice': process.env.AGENT_ID_TIPS || '',
    'hajj-crowd-flow': process.env.AGENT_ID_TIPS || '',
    'insider-routes': process.env.AGENT_ID_TIPS || '',
    // Default fallback
    'default': process.env.AGENT_ID_DEFAULT || '',
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { context, userProfile } = body

        // Get the appropriate agent ID based on context
        const agentId = AGENT_IDS[context] || AGENT_IDS['default']

        if (!agentId) {
            return NextResponse.json(
                { error: 'No agent configured for this context' },
                { status: 400 }
            )
        }

        // Create a ChatKit session with the appropriate agent
        // @ts-expect-error - chatkit is a new API
        const session = await openai.chatkit.sessions.create({
            agent_id: agentId,
            // Pass user context to personalize the conversation
            metadata: {
                user_profile: userProfile,
                context: context,
            },
        })

        return NextResponse.json({
            client_secret: session.client_secret,
        })
    } catch (error) {
        console.error('Error creating ChatKit session:', error)
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
        )
    }
}
