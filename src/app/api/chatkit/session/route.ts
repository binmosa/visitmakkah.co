import { NextRequest, NextResponse } from 'next/server'

// Workflow IDs mapped to context - replace with your actual workflow IDs from Agent Builder
const WORKFLOW_IDS: Record<string, string> = {
    // Your Journey
    'hajj': process.env.WORKFLOW_ID_HAJJ || process.env.WORKFLOW_ID_DEFAULT || '',
    'umrah': process.env.WORKFLOW_ID_UMRAH || process.env.WORKFLOW_ID_DEFAULT || '',
    'rituals': process.env.WORKFLOW_ID_RITUALS || process.env.WORKFLOW_ID_DEFAULT || '',
    'spiritual': process.env.WORKFLOW_ID_SPIRITUAL || process.env.WORKFLOW_ID_DEFAULT || '',
    'your-journey': process.env.WORKFLOW_ID_JOURNEY || process.env.WORKFLOW_ID_DEFAULT || '',

    // Plan
    'plan': process.env.WORKFLOW_ID_PLAN || process.env.WORKFLOW_ID_DEFAULT || '',
    'timeline-builder': process.env.WORKFLOW_ID_PLAN || process.env.WORKFLOW_ID_DEFAULT || '',
    'visa-steps': process.env.WORKFLOW_ID_PLAN || process.env.WORKFLOW_ID_DEFAULT || '',
    'packing': process.env.WORKFLOW_ID_PLAN || process.env.WORKFLOW_ID_DEFAULT || '',
    'transport': process.env.WORKFLOW_ID_PLAN || process.env.WORKFLOW_ID_DEFAULT || '',

    // Stay & Food
    'stay-and-food': process.env.WORKFLOW_ID_STAY_FOOD || process.env.WORKFLOW_ID_DEFAULT || '',
    'hotels': process.env.WORKFLOW_ID_STAY_FOOD || process.env.WORKFLOW_ID_DEFAULT || '',
    'restaurants': process.env.WORKFLOW_ID_STAY_FOOD || process.env.WORKFLOW_ID_DEFAULT || '',
    'women-friendly': process.env.WORKFLOW_ID_STAY_FOOD || process.env.WORKFLOW_ID_DEFAULT || '',
    'late-night': process.env.WORKFLOW_ID_STAY_FOOD || process.env.WORKFLOW_ID_DEFAULT || '',

    // Smart Tools
    'smart-tools': process.env.WORKFLOW_ID_TOOLS || process.env.WORKFLOW_ID_DEFAULT || '',
    'trip-planner': process.env.WORKFLOW_ID_TOOLS || process.env.WORKFLOW_ID_DEFAULT || '',
    'budget-tool': process.env.WORKFLOW_ID_TOOLS || process.env.WORKFLOW_ID_DEFAULT || '',
    'packing-list': process.env.WORKFLOW_ID_TOOLS || process.env.WORKFLOW_ID_DEFAULT || '',
    'distance-calculator': process.env.WORKFLOW_ID_TOOLS || process.env.WORKFLOW_ID_DEFAULT || '',

    // Local Tips
    'local-tips': process.env.WORKFLOW_ID_TIPS || process.env.WORKFLOW_ID_DEFAULT || '',
    'seasonal-hacks': process.env.WORKFLOW_ID_TIPS || process.env.WORKFLOW_ID_DEFAULT || '',
    'ramadan-advice': process.env.WORKFLOW_ID_TIPS || process.env.WORKFLOW_ID_DEFAULT || '',
    'hajj-crowd-flow': process.env.WORKFLOW_ID_TIPS || process.env.WORKFLOW_ID_DEFAULT || '',
    'insider-routes': process.env.WORKFLOW_ID_TIPS || process.env.WORKFLOW_ID_DEFAULT || '',

    // Default fallback
    'default': process.env.WORKFLOW_ID_DEFAULT || '',
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { context, userId } = body

        // Get the appropriate workflow ID based on context
        const workflowId = WORKFLOW_IDS[context] || WORKFLOW_IDS['default']

        if (!workflowId) {
            return NextResponse.json(
                { error: 'No workflow configured. Please set WORKFLOW_ID_DEFAULT in environment variables.' },
                { status: 400 }
            )
        }

        // Create ChatKit session using OpenAI API
        const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'chatkit_beta=v1',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                workflow: { id: workflowId },
                user: userId || `user_${Date.now()}`,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('ChatKit session error:', errorData)
            return NextResponse.json(
                { error: 'Failed to create ChatKit session', details: errorData },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json({
            client_secret: data.client_secret,
        })
    } catch (error) {
        console.error('Error creating ChatKit session:', error)
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
        )
    }
}
