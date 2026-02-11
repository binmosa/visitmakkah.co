/**
 * Saved Page
 *
 * Central hub for users to access:
 * - Saved widgets (checklists, itineraries, duas, etc.)
 * - Conversation history
 * - Quick resume functionality
 */

import { Metadata } from 'next'
import SavedClient from './SavedClient'

export const metadata: Metadata = {
  title: 'Saved | Visit Makkah',
  description: 'Access your saved guides, checklists, itineraries, and conversation history.',
}

export default function SavedPage() {
  return <SavedClient />
}
