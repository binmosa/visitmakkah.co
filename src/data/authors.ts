// Author type definition
// Authors are managed via Sanity CMS

export type TAuthor = {
  id: string
  name: string
  handle: string
  career?: string
  description?: string
  count?: number
  joinedDate?: string
  reviewCount?: number
  rating?: number
  avatar?: {
    src: string
    alt: string
    width: number
    height: number
  }
  cover?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

// Returns empty array - authors are now managed via Sanity CMS
export async function getAuthors(): Promise<TAuthor[]> {
  return []
}

export async function getAuthorByHandle(handle: string): Promise<TAuthor | null> {
  return null
}
