/**
 * Widget Parser
 *
 * Parses AI responses that contain inline widget markers.
 *
 * Format:
 * <<<WIDGET:type>>>
 * { json data }
 * <<<END_WIDGET>>>
 */

import type { WidgetType, WidgetData } from '@/types/widgets'

// Regex to match widget markers
const WIDGET_REGEX = /<<<WIDGET:(\w+)>>>([\s\S]*?)<<<END_WIDGET>>>/g

// Content segment types
export interface TextSegment {
  type: 'text'
  content: string
}

export interface WidgetSegment {
  type: 'widget'
  widgetType: WidgetType
  data: unknown
  raw: string // Original JSON string for debugging
}

export type ContentSegment = TextSegment | WidgetSegment

// Parsed content result
export interface ParsedContent {
  segments: ContentSegment[]
  widgets: WidgetData[]
  hasWidgets: boolean
  textOnly: string // All text without widgets
}

/**
 * Parse AI response content that may contain widget markers
 */
export function parseWidgets(content: string): ParsedContent {
  const segments: ContentSegment[] = []
  const widgets: WidgetData[] = []
  let textOnly = ''

  let lastIndex = 0
  let match

  // Reset regex state
  WIDGET_REGEX.lastIndex = 0

  while ((match = WIDGET_REGEX.exec(content)) !== null) {
    // Add text segment before this widget
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim()
      if (textContent) {
        segments.push({
          type: 'text',
          content: textContent,
        })
        textOnly += textContent + '\n'
      }
    }

    // Parse widget
    const widgetType = match[1] as WidgetType
    const widgetJson = match[2].trim()

    try {
      const data = JSON.parse(widgetJson)
      segments.push({
        type: 'widget',
        widgetType,
        data,
        raw: widgetJson,
      })
      widgets.push({ type: widgetType, data } as WidgetData)
    } catch (e) {
      // Invalid JSON - treat as text with error indication
      console.warn(`Failed to parse widget JSON for type "${widgetType}":`, e)
      segments.push({
        type: 'text',
        content: `[Widget Error: Invalid ${widgetType} data]`,
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text after last widget
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim()
    if (textContent) {
      segments.push({
        type: 'text',
        content: textContent,
      })
      textOnly += textContent
    }
  }

  // Handle case where there are no widgets
  if (segments.length === 0 && content.trim()) {
    segments.push({
      type: 'text',
      content: content.trim(),
    })
    textOnly = content.trim()
  }

  return {
    segments,
    widgets,
    hasWidgets: widgets.length > 0,
    textOnly: textOnly.trim(),
  }
}

/**
 * Check if content contains widget markers (quick check without full parsing)
 */
export function hasWidgetMarkers(content: string): boolean {
  return content.includes('<<<WIDGET:') && content.includes('<<<END_WIDGET>>>')
}

/**
 * Extract just the widget types from content (quick extraction)
 */
export function extractWidgetTypes(content: string): WidgetType[] {
  const types: WidgetType[] = []
  const typeRegex = /<<<WIDGET:(\w+)>>>/g
  let match

  while ((match = typeRegex.exec(content)) !== null) {
    types.push(match[1] as WidgetType)
  }

  return types
}

/**
 * Strip all widget markers from content, leaving only text
 */
export function stripWidgets(content: string): string {
  return content.replace(WIDGET_REGEX, '').replace(/\n{3,}/g, '\n\n').trim()
}

/**
 * Create a widget marker string (for AI to use in responses)
 */
export function createWidgetMarker(type: WidgetType, data: unknown): string {
  return `<<<WIDGET:${type}>>>\n${JSON.stringify(data, null, 2)}\n<<<END_WIDGET>>>`
}

/**
 * Validate widget data against expected type
 * Returns true if data has required fields for the widget type
 */
export function validateWidgetData(type: WidgetType, data: unknown): boolean {
  if (!data || typeof data !== 'object') return false

  const d = data as Record<string, unknown>

  switch (type) {
    case 'itinerary':
      return !!(d.title && d.days && Array.isArray(d.days))

    case 'checklist':
      return !!(d.title && d.categories && Array.isArray(d.categories))

    case 'budget':
      return !!(d.title && d.total !== undefined && d.breakdown && Array.isArray(d.breakdown))

    case 'guide':
      return !!(d.title && d.steps && Array.isArray(d.steps))

    case 'dua':
      return !!(d.title && d.arabic && d.transliteration && d.translation)

    case 'ritual':
      return !!(d.title && d.steps && Array.isArray(d.steps))

    case 'places':
      return !!(d.title && d.places && Array.isArray(d.places))

    case 'crowd':
      return !!(d.title && d.location && d.forecast && Array.isArray(d.forecast))

    case 'navigation':
      return !!(d.from && d.to && d.steps && Array.isArray(d.steps))

    case 'tips':
      return !!(d.title && d.tips && Array.isArray(d.tips))

    default:
      return false
  }
}

/**
 * Parse streaming content that may be incomplete
 * Returns segments that are complete, plus any incomplete text
 */
export interface StreamingParseResult {
  completeSegments: ContentSegment[]
  incompleteText: string
  isComplete: boolean
}

export function parseStreamingContent(content: string): StreamingParseResult {
  const completeSegments: ContentSegment[] = []
  let incompleteText = ''

  // Check if we have an incomplete widget marker at the end
  const lastWidgetStart = content.lastIndexOf('<<<WIDGET:')
  const lastWidgetEnd = content.lastIndexOf('<<<END_WIDGET>>>')

  // If there's an unclosed widget marker, treat everything after it as incomplete
  if (lastWidgetStart > lastWidgetEnd) {
    // Parse complete portion
    const completeContent = content.slice(0, lastWidgetStart)
    const parsed = parseWidgets(completeContent)
    completeSegments.push(...parsed.segments)

    // Keep incomplete portion
    incompleteText = content.slice(lastWidgetStart)

    return {
      completeSegments,
      incompleteText,
      isComplete: false,
    }
  }

  // All content is complete
  const parsed = parseWidgets(content)
  return {
    completeSegments: parsed.segments,
    incompleteText: '',
    isComplete: true,
  }
}
