import { NextRequest, NextResponse } from 'next/server'

// Classification type for routing
type Classification = 'prepare' | 'learn' | 'explore' | 'blog'

// Routing metadata from client
interface RoutingMetadata {
    classification: Classification
    action: string      // e.g., 'build-itinerary', 'find-food'
    actionLabel: string // e.g., 'Build My Itinerary', 'Find Food'
}

// User profile for context
interface UserProfile {
    journeyStage?: string
    journeyType?: string
    isFirstTime?: boolean
    travelGroup?: string
    gender?: string | null
    country?: string | null
}

// Workflow IDs mapped to classification - use a single classifier workflow
// The classifier will then route to sub-agents based on the metadata
const WORKFLOW_IDS: Record<string, string> = {
    // Main classifier workflow - routes based on classification metadata
    'classifier': process.env.WORKFLOW_ID_CLASSIFIER || process.env.WORKFLOW_ID_DEFAULT || '',

    // Category-specific workflows (if you want direct routing without classifier)
    'prepare': process.env.WORKFLOW_ID_PREPARE || process.env.WORKFLOW_ID_DEFAULT || '',
    'learn': process.env.WORKFLOW_ID_LEARN || process.env.WORKFLOW_ID_DEFAULT || '',
    'explore': process.env.WORKFLOW_ID_EXPLORE || process.env.WORKFLOW_ID_DEFAULT || '',
    'blog': process.env.WORKFLOW_ID_BLOG || process.env.WORKFLOW_ID_DEFAULT || '',

    // Default fallback
    'default': process.env.WORKFLOW_ID_DEFAULT || '',
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            context,
            userId,
            userProfile,
            routing,
            initialQuestion,
        } = body as {
            context: string
            userId: string
            userProfile?: UserProfile
            routing?: RoutingMetadata
            initialQuestion?: string
        }

        // Determine which workflow to use
        // Option 1: Use classifier workflow (recommended - single entry point)
        // Option 2: Route directly to category workflow based on classification
        const useClassifier = process.env.USE_CLASSIFIER_WORKFLOW === 'true'
        const workflowId = useClassifier
            ? WORKFLOW_IDS['classifier']
            : WORKFLOW_IDS[routing?.classification || 'default'] || WORKFLOW_IDS['default']

        if (!workflowId) {
            return NextResponse.json(
                { error: 'No workflow configured. Please set WORKFLOW_ID_DEFAULT in environment variables.' },
                { status: 400 }
            )
        }

        // Build context string for the agent classifier
        // This embedded text helps the classifier route to the correct sub-agent
        const routingContext = buildRoutingContext(routing, userProfile, initialQuestion)

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
                // Pass routing context as initial context for the agent
                context: routingContext,
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

/**
 * Build a structured routing context string for the agent classifier.
 * This text is embedded at the start of the conversation to help the
 * classifier route messages to the correct sub-agent.
 *
 * Format:
 * [ROUTING_CONTEXT]
 * classification: prepare
 * action: build-itinerary
 * action_label: Build My Itinerary
 * [USER_PROFILE]
 * journey_stage: planning
 * journey_type: umrah
 * is_first_time: true
 * gender: male
 * country: US
 * [/ROUTING_CONTEXT]
 */
function buildRoutingContext(
    routing?: RoutingMetadata,
    userProfile?: UserProfile,
    initialQuestion?: string
): string {
    const lines: string[] = ['[ROUTING_CONTEXT]']

    // Add routing metadata
    if (routing) {
        lines.push(`classification: ${routing.classification}`)
        lines.push(`action: ${routing.action}`)
        lines.push(`action_label: ${routing.actionLabel}`)
    }

    // Add user profile
    if (userProfile) {
        lines.push('[USER_PROFILE]')
        if (userProfile.journeyStage) lines.push(`journey_stage: ${userProfile.journeyStage}`)
        if (userProfile.journeyType) lines.push(`journey_type: ${userProfile.journeyType}`)
        if (userProfile.isFirstTime !== undefined) lines.push(`is_first_time: ${userProfile.isFirstTime}`)
        if (userProfile.travelGroup) lines.push(`travel_group: ${userProfile.travelGroup}`)
        if (userProfile.gender) lines.push(`gender: ${userProfile.gender}`)
        if (userProfile.country) lines.push(`country: ${userProfile.country}`)
    }

    // Add initial question context if provided
    if (initialQuestion) {
        lines.push('[INITIAL_QUESTION]')
        lines.push(initialQuestion)
    }

    lines.push('[/ROUTING_CONTEXT]')

    return lines.join('\n')
}
