/**
 * Client Tools for OpenAI ChatKit
 * These tools are called by the agent and executed on the client side
 */

// Context entry type for structured key-value data
export interface ContextEntry {
    key: string
    value: string | number | boolean | null
}

// Session context (page/action) - set by AIChatPanel
let currentSessionContext: {
    page: string
    action: string
    actionLabel: string
} | null = null

// User profile getter - will be set by the component
let getUserProfile: (() => {
    journeyStage: string | null
    journeyType: string | null
    isFirstTime: boolean | null
    gender: string | null
    country: string | null
    travelGroup: string | null
    departureDate: string | null
    returnDate: string | null
    completedOnboarding: boolean
    preparationProgress: number
    packingProgress: number
    daysUntilDeparture: number | null
}) | null = null

/**
 * Set the current session context (called by AIChatPanel)
 */
export function setSessionContext(context: {
    page: string
    action: string
    actionLabel: string
}) {
    currentSessionContext = context
}

/**
 * Set the user profile getter (called by AIChatPanel)
 */
export function setUserProfileGetter(getter: typeof getUserProfile) {
    getUserProfile = getter
}

/**
 * Get user context - returns all context as key-value entries
 * Called by the agent to understand the current user state
 */
export function get_user_context(): { entries: ContextEntry[] } {
    const entries: ContextEntry[] = []

    // Page context
    if (currentSessionContext) {
        entries.push({ key: 'current_page', value: currentSessionContext.page })
        entries.push({ key: 'current_action', value: currentSessionContext.action })
        entries.push({ key: 'current_action_label', value: currentSessionContext.actionLabel })
    } else {
        entries.push({ key: 'current_page', value: 'unknown' })
        entries.push({ key: 'current_action', value: 'unknown' })
        entries.push({ key: 'current_action_label', value: 'Unknown' })
    }

    // User profile
    if (getUserProfile) {
        const profile = getUserProfile()
        entries.push({ key: 'journey_stage', value: profile.journeyStage })
        entries.push({ key: 'journey_type', value: profile.journeyType })
        entries.push({ key: 'is_first_time', value: profile.isFirstTime })
        entries.push({ key: 'gender', value: profile.gender })
        entries.push({ key: 'country', value: profile.country })
        entries.push({ key: 'travel_group', value: profile.travelGroup })
        entries.push({ key: 'departure_date', value: profile.departureDate })
        entries.push({ key: 'return_date', value: profile.returnDate })
        entries.push({ key: 'days_until_departure', value: profile.daysUntilDeparture })
        entries.push({ key: 'completed_onboarding', value: profile.completedOnboarding })
        entries.push({ key: 'preparation_progress', value: profile.preparationProgress })
        entries.push({ key: 'packing_progress', value: profile.packingProgress })
    } else {
        entries.push({ key: 'journey_stage', value: null })
        entries.push({ key: 'journey_type', value: null })
        entries.push({ key: 'is_first_time', value: null })
        entries.push({ key: 'gender', value: null })
        entries.push({ key: 'country', value: null })
        entries.push({ key: 'travel_group', value: null })
        entries.push({ key: 'departure_date', value: null })
        entries.push({ key: 'return_date', value: null })
        entries.push({ key: 'days_until_departure', value: null })
        entries.push({ key: 'completed_onboarding', value: false })
        entries.push({ key: 'preparation_progress', value: 0 })
        entries.push({ key: 'packing_progress', value: 0 })
    }

    return { entries }
}

// Tool result type
export interface ClientToolResult {
    success: boolean
    data?: unknown
    error?: string
}

// Client tool handler type
export type ClientToolHandler = (
    params: Record<string, unknown>
) => Promise<ClientToolResult> | ClientToolResult

/**
 * All client tools mapped by name
 */
export const clientTools: Record<string, ClientToolHandler> = {
    get_user_context: async () => {
        const result = get_user_context()
        return {
            success: true,
            data: result,
        }
    },

    // Add more tools here as needed:
    // save_itinerary: async (params) => { ... },
    // bookmark_dua: async (params) => { ... },
    // etc.
}

/**
 * Handle a client tool call from ChatKit
 */
export async function handleClientTool(
    toolName: string,
    params: Record<string, unknown>
): Promise<ClientToolResult> {
    const handler = clientTools[toolName]

    if (!handler) {
        console.warn(`[ClientTools] Unknown tool: ${toolName}`)
        return {
            success: false,
            error: `Unknown tool: ${toolName}`,
        }
    }

    try {
        const result = await handler(params)
        console.log(`[ClientTools] ${toolName} result:`, result)
        return result
    } catch (error) {
        console.error(`[ClientTools] Error in ${toolName}:`, error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}
