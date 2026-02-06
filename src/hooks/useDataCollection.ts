'use client'

import { useEffect, useRef, useCallback } from 'react'
import { getOrCreateAnonymousVisitor, getDeviceId, createChatTopic, saveChatMessage, endChatTopic } from '@/lib/data-service'
import { getCurrentUser } from '@/lib/auth'

/**
 * Hook for chat data collection (gold data for AI training)
 * Use this in chat components to track topics and messages
 */
export function useChatDataCollection(context: string, contextLabel?: string) {
    const topicIdRef = useRef<string | null>(null)
    const anonymousIdRef = useRef<string | null>(null)
    const profileIdRef = useRef<string | null>(null)
    const initialized = useRef(false)

    // Initialize on mount
    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const init = async () => {
            // Check if user is logged in
            const user = await getCurrentUser()

            if (user) {
                profileIdRef.current = user.id
            } else {
                // Get or create anonymous visitor
                const deviceId = getDeviceId()
                const visitor = await getOrCreateAnonymousVisitor(deviceId)
                if (visitor) {
                    anonymousIdRef.current = visitor.id
                }
            }

            // Create chat topic
            const topic = await createChatTopic({
                profileId: profileIdRef.current || undefined,
                anonymousId: anonymousIdRef.current || undefined,
                context,
                contextLabel,
            })

            if (topic) {
                topicIdRef.current = topic.id
            }
        }

        init()

        // End topic on unmount
        return () => {
            if (topicIdRef.current) {
                endChatTopic(topicIdRef.current)
            }
        }
    }, [context, contextLabel])

    // Track a message
    const trackMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
        if (!topicIdRef.current) return null

        return saveChatMessage({
            topicId: topicIdRef.current,
            role,
            content,
            context,
        })
    }, [context])

    return {
        topicId: topicIdRef.current,
        trackMessage,
    }
}
