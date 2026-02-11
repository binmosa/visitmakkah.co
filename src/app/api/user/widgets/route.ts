/**
 * Saved Widgets API
 *
 * CRUD operations for user's saved widgets.
 * GET: Fetch all saved widgets
 * POST: Save a new widget
 * DELETE: Remove a saved widget
 */

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export interface SavedWidget {
  id: string
  widgetType: string
  title: string
  description: string | null
  widgetData: Record<string, unknown>
  sourceContext: string | null
  customTitle: string | null
  notes: string | null
  isPinned: boolean
  widgetState: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// GET: Fetch saved widgets
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get('deviceId')
  const widgetType = searchParams.get('type') // Optional filter

  if (!deviceId) {
    return new Response(
      JSON.stringify({ error: 'deviceId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabase = getSupabaseAdmin()

    // Get anonymous visitor ID
    const { data: visitor } = await supabase
      .from('anonymous_visitors')
      .select('id')
      .eq('device_id', deviceId)
      .single()

    if (!visitor) {
      return new Response(
        JSON.stringify({ widgets: [] }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build query
    let query = supabase
      .from('saved_widgets')
      .select('*')
      .eq('anonymous_id', visitor.id)
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false })

    if (widgetType) {
      query = query.eq('widget_type', widgetType)
    }

    const { data: widgets, error } = await query

    if (error) {
      console.error('Error fetching widgets:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch widgets' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Transform to camelCase
    const transformedWidgets: SavedWidget[] = (widgets || []).map((w) => ({
      id: w.id,
      widgetType: w.widget_type,
      title: w.title,
      description: w.description,
      widgetData: w.widget_data,
      sourceContext: w.source_context,
      customTitle: w.custom_title,
      notes: w.notes,
      isPinned: w.is_pinned,
      widgetState: w.widget_state,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
    }))

    return new Response(
      JSON.stringify({ widgets: transformedWidgets }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Widgets API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch widgets' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// POST: Save a new widget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      deviceId,
      widgetType,
      title,
      description,
      widgetData,
      sourceContext,
      sourceTopicId,
      widgetState,
    } = body

    if (!deviceId || !widgetType || !title || !widgetData) {
      return new Response(
        JSON.stringify({ error: 'deviceId, widgetType, title, and widgetData are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getSupabaseAdmin()

    // Get or create anonymous visitor
    let { data: visitor } = await supabase
      .from('anonymous_visitors')
      .select('id')
      .eq('device_id', deviceId)
      .single()

    if (!visitor) {
      const { data: newVisitor, error: createError } = await supabase
        .from('anonymous_visitors')
        .insert({ device_id: deviceId })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating visitor:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create visitor' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      visitor = newVisitor
    }

    // Check for duplicate (same type + title + context)
    const { data: existing } = await supabase
      .from('saved_widgets')
      .select('id')
      .eq('anonymous_id', visitor.id)
      .eq('widget_type', widgetType)
      .eq('title', title)
      .eq('source_context', sourceContext || '')
      .single()

    if (existing) {
      // Update existing widget
      const { data: updated, error: updateError } = await supabase
        .from('saved_widgets')
        .update({
          widget_data: widgetData,
          widget_state: widgetState,
          description,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating widget:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update widget' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ widget: updated, updated: true }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Insert new widget
    const { data: widget, error } = await supabase
      .from('saved_widgets')
      .insert({
        anonymous_id: visitor.id,
        widget_type: widgetType,
        title,
        description,
        widget_data: widgetData,
        source_context: sourceContext,
        source_topic_id: sourceTopicId,
        widget_state: widgetState,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving widget:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save widget' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ widget, created: true }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Save widget error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to save widget' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// DELETE: Remove a saved widget
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const widgetId = searchParams.get('id')
  const deviceId = searchParams.get('deviceId')

  if (!widgetId || !deviceId) {
    return new Response(
      JSON.stringify({ error: 'id and deviceId are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabase = getSupabaseAdmin()

    // Verify ownership via device ID
    const { data: visitor } = await supabase
      .from('anonymous_visitors')
      .select('id')
      .eq('device_id', deviceId)
      .single()

    if (!visitor) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabase
      .from('saved_widgets')
      .delete()
      .eq('id', widgetId)
      .eq('anonymous_id', visitor.id)

    if (error) {
      console.error('Error deleting widget:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to delete widget' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Delete widget error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete widget' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
