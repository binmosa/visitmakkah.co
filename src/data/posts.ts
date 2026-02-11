// Post type definitions
// Posts are now managed via Sanity CMS

export type TPost = {
  id: string
  featuredImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
  title: string
  handle: string
  excerpt?: string
  date: string
  readingTime?: number
  commentCount?: number
  viewCount?: number
  bookmarkCount?: number
  bookmarked?: boolean
  likeCount?: number
  liked?: boolean
  postType?: 'standard' | 'audio' | 'video' | 'gallery'
  status?: string
  audioUrl?: string
  videoUrl?: string
  galleryImgs?: string[]
  author?: {
    id: string
    name: string
    handle: string
    avatar?: {
      src: string
      alt: string
      width: number
      height: number
    }
  }
  categories?: Array<{
    id: string
    name: string
    handle: string
    color?: string
  }>
}

export type TPostDetail = TPost & {
  content?: string
  tags?: Array<{
    id: string
    name: string
    handle: string
    color?: string
  }>
}

export type TComment = {
  id: number
  author: {
    id: string
    name: string
    handle: string
    avatar?: {
      src: string
      alt: string
      width: number
      height: number
    }
  }
  date: string
  content: string
  like: {
    count: number
    isLiked: boolean
  }
}

// Returns empty array - posts are now managed via Sanity CMS
export async function getAllPosts(): Promise<TPost[]> {
  return []
}

export async function getPostsDefault(): Promise<TPost[]> {
  return []
}

export async function getPostsAudio(): Promise<TPost[]> {
  return []
}

export async function getPostsVideo(): Promise<TPost[]> {
  return []
}

export async function getPostsGallery(): Promise<TPost[]> {
  return []
}

export async function getPostByHandle(handle: string): Promise<TPostDetail | null> {
  return null
}

export async function getCommentsByPostId(postId: string): Promise<TComment[]> {
  return []
}
