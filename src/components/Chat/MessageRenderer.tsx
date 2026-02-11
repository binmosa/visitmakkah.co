'use client'

/**
 * MessageRenderer Component
 *
 * Renders AI message content including text and inline widgets.
 * Handles streaming by showing placeholders for incomplete widgets.
 */

import { useMemo } from 'react'
import { parseStreamingContent, type ContentSegment } from '@/lib/widget-parser'
import { WidgetRenderer } from './WidgetRenderer'
import { StreamingWidgetPlaceholder } from './StreamingWidgetPlaceholder'

interface MessageRendererProps {
  content: string
  className?: string
  isStreaming?: boolean
  contextAction?: string
}

export function MessageRenderer({ content, className = '', isStreaming = false, contextAction }: MessageRendererProps) {
  // Parse content with streaming awareness
  const { completeSegments, incompleteText, isComplete, incompleteWidgetType } = useMemo(() => {
    const result = parseStreamingContent(content)

    // Try to extract the widget type from incomplete text
    let widgetType: string | undefined
    if (result.incompleteText) {
      const typeMatch = result.incompleteText.match(/<<<WIDGET:(\w+)>>>/)
      if (typeMatch) {
        widgetType = typeMatch[1]
      }
    }

    return {
      ...result,
      incompleteWidgetType: widgetType,
    }
  }, [content])

  // Filter out any text segments that contain raw widget markers or JSON-like content
  const filteredSegments = useMemo(() => {
    return completeSegments.filter(segment => {
      if (segment.type === 'text') {
        // Hide text that looks like it's part of widget markup
        const text = segment.content.trim()
        if (text.startsWith('{') || text.startsWith('"') || text.includes('<<<')) {
          return false
        }
      }
      return true
    })
  }, [completeSegments])

  return (
    <div className={`space-y-4 ${className}`}>
      {filteredSegments.map((segment, index) => (
        <SegmentRenderer key={index} segment={segment} contextAction={contextAction} />
      ))}

      {/* Show placeholder when widget is being streamed */}
      {incompleteText && incompleteText.includes('<<<WIDGET:') && (
        <StreamingWidgetPlaceholder widgetType={incompleteWidgetType} />
      )}
    </div>
  )
}

interface SegmentRendererProps {
  segment: ContentSegment
  contextAction?: string
}

function SegmentRenderer({ segment, contextAction }: SegmentRendererProps) {
  if (segment.type === 'text') {
    return <TextContent content={segment.content} />
  }

  if (segment.type === 'widget') {
    return (
      <WidgetRenderer
        type={segment.widgetType}
        data={segment.data}
        contextAction={contextAction}
      />
    )
  }

  return null
}

interface TextContentProps {
  content: string
}

function TextContent({ content }: TextContentProps) {
  // Skip empty content
  if (!content.trim()) return null

  // Simple markdown-like rendering
  // For a full solution, use react-markdown or similar
  const lines = content.split('\n')

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary-600 dark:prose-a:text-primary-400">
      {lines.map((line, i) => {
        const trimmedLine = line.trim()

        // Empty line = paragraph break
        if (!trimmedLine) {
          return <br key={i} />
        }

        // Headers
        if (trimmedLine.startsWith('### ')) {
          return (
            <h3 key={i} className="mt-4 mb-2 text-base font-semibold text-neutral-900 dark:text-white">
              {trimmedLine.slice(4)}
            </h3>
          )
        }
        if (trimmedLine.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-5 mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
              {trimmedLine.slice(3)}
            </h2>
          )
        }
        if (trimmedLine.startsWith('# ')) {
          return (
            <h1 key={i} className="mt-6 mb-3 text-xl font-bold text-neutral-900 dark:text-white">
              {trimmedLine.slice(2)}
            </h1>
          )
        }

        // Bullet points
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 ml-1">
              <span className="text-primary-500">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                <InlineFormatting text={trimmedLine.slice(2)} />
              </span>
            </div>
          )
        }

        // Numbered lists
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 ml-1">
              <span className="text-primary-500 font-medium min-w-[1.5rem]">{numberedMatch[1]}.</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                <InlineFormatting text={numberedMatch[2]} />
              </span>
            </div>
          )
        }

        // Regular paragraph
        return (
          <p key={i} className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <InlineFormatting text={trimmedLine} />
          </p>
        )
      })}
    </div>
  )
}

interface InlineFormattingProps {
  text: string
}

function InlineFormatting({ text }: InlineFormattingProps) {
  // Handle inline formatting: **bold**, *italic*, `code`
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIndex = 0

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Italic
    const italicMatch = remaining.match(/\*(.+?)\*/)
    // Code
    const codeMatch = remaining.match(/`(.+?)`/)

    // Find the earliest match
    const matches = [
      boldMatch ? { type: 'bold', match: boldMatch, index: remaining.indexOf(boldMatch[0]) } : null,
      italicMatch ? { type: 'italic', match: italicMatch, index: remaining.indexOf(italicMatch[0]) } : null,
      codeMatch ? { type: 'code', match: codeMatch, index: remaining.indexOf(codeMatch[0]) } : null,
    ].filter((m): m is NonNullable<typeof m> => m !== null)

    if (matches.length === 0) {
      // No more formatting, add remaining text
      parts.push(remaining)
      break
    }

    // Sort by index to find earliest
    matches.sort((a, b) => a.index - b.index)
    const earliest = matches[0]

    // Add text before the match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index))
    }

    // Add formatted content
    if (earliest.type === 'bold') {
      parts.push(
        <strong key={keyIndex++} className="font-semibold text-neutral-900 dark:text-white">
          {earliest.match[1]}
        </strong>
      )
    } else if (earliest.type === 'italic') {
      parts.push(
        <em key={keyIndex++} className="italic">
          {earliest.match[1]}
        </em>
      )
    } else if (earliest.type === 'code') {
      parts.push(
        <code
          key={keyIndex++}
          className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-primary-600 dark:text-primary-400"
        >
          {earliest.match[1]}
        </code>
      )
    }

    // Continue with remaining text
    remaining = remaining.slice(earliest.index + earliest.match[0].length)
  }

  return <>{parts}</>
}

export default MessageRenderer
