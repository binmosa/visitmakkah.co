import { NextRequest, NextResponse } from 'next/server'

// Context metadata from client (hidden from user UI)
interface ContextMetadata {
    page: string        // e.g., 'prepare', 'learn', 'explore'
    action: string      // e.g., 'find-hotels', 'build-itinerary'
    actionLabel: string // e.g., 'Find Hotels', 'Build My Itinerary'
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            userId,
            context,
        } = body as {
            userId: string
            context?: ContextMetadata
        }

        // Use single workflow ID
        const workflowId = process.env.WORKFLOW_ID_DEFAULT

        if (!workflowId) {
            return NextResponse.json(
                { error: 'No workflow configured. Please set WORKFLOW_ID_DEFAULT in environment variables.' },
                { status: 400 }
            )
        }

        // Create ChatKit session using OpenAI API
        // Note: Context metadata is logged server-side but not sent to OpenAI
        // (OpenAI ChatKit API doesn't support a 'context' parameter)
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

        // Log context for debugging (server-side only)
        if (process.env.NODE_ENV === 'development') {
            console.log('Session context:', { page: context?.page, action: context?.action, actionLabel: context?.actionLabel })
        }

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
