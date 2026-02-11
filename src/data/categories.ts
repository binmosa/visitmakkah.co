// Category and Tag type definitions
// Categories and tags are now managed via Sanity CMS

import { TPost } from './posts'

export type TCategory = {
  id: string
  name: string
  handle: string
  description?: string
  color?: string
  count?: number
  date?: string
  thumbnail?: {
    src: string
    alt: string
    width: number
    height: number
  }
  posts?: TPost[]
}

export type TTag = {
  id: string
  name: string
  handle: string
  description?: string
  color?: string
  count?: number
  posts?: TPost[]
}

// Returns empty array - categories are now managed via Sanity CMS
export async function getCategories(): Promise<TCategory[]> {
  return []
}

export async function getCategoriesWithPosts(): Promise<TCategory[]> {
  return []
}

export async function getCategoryByHandle(handle: string): Promise<TCategory | null> {
  return null
}

export async function getTags(): Promise<TTag[]> {
  return []
}

export async function getTagsWithPosts(): Promise<TTag[]> {
  return []
}

export async function getTagByHandle(handle: string): Promise<TTag | null> {
  return null
}
