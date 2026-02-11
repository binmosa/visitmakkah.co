/**
 * Conversation Storage
 *
 * Persists chat conversations to localStorage.
 * Each conversation is keyed by contextAction (e.g., "build-itinerary").
 */

interface StoredMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface StoredConversation {
  id: string
  contextAction: string
  messages: StoredMessage[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY_PREFIX = 'vm_conversation_'
const CONVERSATIONS_INDEX_KEY = 'vm_conversations_index'

/**
 * Generate a unique conversation ID
 */
export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get the storage key for a conversation
 */
function getStorageKey(contextAction: string): string {
  return `${STORAGE_KEY_PREFIX}${contextAction}`
}

/**
 * Save a conversation to localStorage
 */
export function saveConversation(conversation: StoredConversation): void {
  if (typeof window === 'undefined') return

  try {
    const key = getStorageKey(conversation.contextAction)
    localStorage.setItem(key, JSON.stringify(conversation))

    // Update index
    const index = getConversationsIndex()
    if (!index.includes(conversation.contextAction)) {
      index.push(conversation.contextAction)
      localStorage.setItem(CONVERSATIONS_INDEX_KEY, JSON.stringify(index))
    }
  } catch (e) {
    console.error('[conversation-storage] Failed to save:', e)
  }
}

/**
 * Load a conversation from localStorage
 */
export function loadConversation(contextAction: string): StoredConversation | null {
  if (typeof window === 'undefined') return null

  try {
    const key = getStorageKey(contextAction)
    const data = localStorage.getItem(key)
    if (!data) return null

    return JSON.parse(data) as StoredConversation
  } catch (e) {
    console.error('[conversation-storage] Failed to load:', e)
    return null
  }
}

/**
 * Add a message to an existing conversation
 */
export function addMessageToConversation(
  contextAction: string,
  message: Omit<StoredMessage, 'timestamp'>
): StoredConversation {
  let conversation = loadConversation(contextAction)

  if (!conversation) {
    conversation = {
      id: generateConversationId(),
      contextAction,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  conversation.messages.push({
    ...message,
    timestamp: Date.now(),
  })
  conversation.updatedAt = Date.now()

  saveConversation(conversation)
  return conversation
}

/**
 * Update the last assistant message (for streaming)
 */
export function updateLastAssistantMessage(
  contextAction: string,
  content: string
): void {
  const conversation = loadConversation(contextAction)
  if (!conversation) return

  const lastMessage = conversation.messages[conversation.messages.length - 1]
  if (lastMessage && lastMessage.role === 'assistant') {
    lastMessage.content = content
    conversation.updatedAt = Date.now()
    saveConversation(conversation)
  }
}

/**
 * Clear a conversation
 */
export function clearConversation(contextAction: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = getStorageKey(contextAction)
    localStorage.removeItem(key)

    // Update index
    const index = getConversationsIndex()
    const newIndex = index.filter(a => a !== contextAction)
    localStorage.setItem(CONVERSATIONS_INDEX_KEY, JSON.stringify(newIndex))
  } catch (e) {
    console.error('[conversation-storage] Failed to clear:', e)
  }
}

/**
 * Get list of all conversation context actions
 */
export function getConversationsIndex(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(CONVERSATIONS_INDEX_KEY)
    if (!data) return []
    return JSON.parse(data) as string[]
  } catch (e) {
    return []
  }
}

/**
 * Get all conversations
 */
export function getAllConversations(): StoredConversation[] {
  const index = getConversationsIndex()
  const conversations: StoredConversation[] = []

  for (const contextAction of index) {
    const conv = loadConversation(contextAction)
    if (conv) {
      conversations.push(conv)
    }
  }

  return conversations.sort((a, b) => b.updatedAt - a.updatedAt)
}

/**
 * Clear all conversations
 */
export function clearAllConversations(): void {
  if (typeof window === 'undefined') return

  const index = getConversationsIndex()
  for (const contextAction of index) {
    const key = getStorageKey(contextAction)
    localStorage.removeItem(key)
  }
  localStorage.removeItem(CONVERSATIONS_INDEX_KEY)
}
