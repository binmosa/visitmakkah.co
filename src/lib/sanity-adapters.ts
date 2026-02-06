/**
 * Sanity Data Adapters
 * Transform Sanity data to match existing component types
 */

import { urlFor } from './sanity'
import { TPost } from '@/data/posts'
import { TCategory } from '@/data/categories'

// Types for Sanity data
interface SanityImage {
    _type: 'image'
    asset: {
        _ref: string
        _type: 'reference'
    }
    alt?: string
    caption?: string
}

interface SanityAuthor {
    _id: string
    name: string
    slug: { current: string }
    image?: SanityImage
    bio?: string
    role?: string
    credentials?: string[]
}

interface SanityCategory {
    _id: string
    title: string
    slug: { current: string }
    description?: string
    icon?: string
    color?: string
}

interface SanityPost {
    _id: string
    title: string
    slug: { current: string }
    excerpt?: string
    featuredImage?: SanityImage & { alt?: string }
    publishedAt?: string
    updatedAt?: string
    readingTime?: number
    featured?: boolean
    author?: SanityAuthor
    categories?: SanityCategory[]
    tags?: Array<{ _id: string; title: string; slug: { current: string } }>
    body?: any[]
    seo?: {
        metaTitle?: string
        metaDescription?: string
        keywords?: string[]
        ogImage?: SanityImage
        canonicalUrl?: string
        noIndex?: boolean
    }
}

/**
 * Transform Sanity post to TPost format for existing components
 */
export function sanityPostToTPost(post: SanityPost, index = 0): TPost {
    const imageUrl = post.featuredImage
        ? urlFor(post.featuredImage).width(1920).height(1080).url()
        : `/images/placeholder-${(index % 5) + 1}.jpg`

    const authorImageUrl = post.author?.image
        ? urlFor(post.author.image).width(200).height(200).url()
        : '/images/avatar-placeholder.jpg'

    return {
        id: post._id,
        title: post.title,
        handle: post.slug.current,
        excerpt: post.excerpt || '',
        date: post.publishedAt || new Date().toISOString(),
        readingTime: post.readingTime || 5,
        commentCount: 0,
        viewCount: 0,
        bookmarkCount: 0,
        bookmarked: false,
        likeCount: 0,
        liked: false,
        postType: 'standard' as const,
        status: 'published' as const,
        featuredImage: {
            src: imageUrl,
            alt: post.featuredImage?.alt || post.title,
            width: 1920,
            height: 1080,
        },
        author: post.author ? {
            id: post.author._id,
            name: post.author.name,
            handle: post.author.slug.current,
            avatar: {
                src: authorImageUrl,
                alt: post.author.name,
                width: 200,
                height: 200,
            },
        } : {
            id: 'local-guide',
            name: 'Local Guide',
            handle: 'local-guide',
            avatar: {
                src: '/images/avatar-placeholder.jpg',
                alt: 'Local Guide',
                width: 200,
                height: 200,
            },
        },
        categories: (post.categories || []).map(cat => ({
            id: cat._id,
            name: cat.title,
            handle: cat.slug.current,
            color: (cat.color || 'emerald') as any,
        })),
    }
}

/**
 * Transform Sanity category to TCategory format
 */
export function sanityCategoryToTCategory(category: SanityCategory, posts: SanityPost[] = []): TCategory {
    return {
        id: category._id,
        name: category.title,
        handle: category.slug.current,
        description: category.description || '',
        color: (category.color || 'emerald') as any,
        count: posts.length,
        date: new Date().toISOString().split('T')[0],
        thumbnail: {
            src: '/images/blog-category.jpg',
            alt: category.title,
            width: 400,
            height: 400,
        },
        posts: posts.map((post, index) => sanityPostToTPost(post, index)),
    }
}

/**
 * Create a "Local Insights" blog category for the blog homepage
 */
export function createBlogCategory(posts: SanityPost[]): TCategory {
    return {
        id: 'blog',
        name: 'Local Insights',
        handle: 'blog',
        description: 'Real experiences and insider knowledge from locals who know Makkah. Get authentic tips, hidden gems, and practical advice that you won\'t find in generic travel guides.',
        color: 'emerald' as any,
        count: posts.length,
        date: new Date().toISOString().split('T')[0],
        thumbnail: {
            src: '/images/blog-cover.jpg',
            alt: 'Visit Makkah Blog',
            width: 400,
            height: 400,
        },
        posts: posts.map((post, index) => sanityPostToTPost(post, index)),
    }
}

/**
 * Transform Sanity post to TPostDetail format for single post page
 * This matches the structure expected by SingleHeaderContainer and SingleContentContainer
 */
export function sanityPostToPostDetail(post: SanityPost, index = 0) {
    const imageUrl = post.featuredImage
        ? urlFor(post.featuredImage).width(1920).height(1080).url()
        : `/images/placeholder-${(index % 5) + 1}.jpg`

    const authorImageUrl = post.author?.image
        ? urlFor(post.author.image).width(200).height(200).url()
        : '/images/avatar-placeholder.jpg'

    return {
        id: post._id,
        title: post.title,
        handle: post.slug.current,
        excerpt: post.excerpt || '',
        date: post.publishedAt || new Date().toISOString(),
        readingTime: post.readingTime || 5,
        commentCount: 0,
        viewCount: 0,
        bookmarkCount: 0,
        bookmarked: false,
        likeCount: 0,
        liked: false,
        postType: 'standard' as const,
        status: 'published' as const,
        featuredImage: {
            src: imageUrl,
            alt: post.featuredImage?.alt || post.title,
            width: 1920,
            height: 1080,
        },
        author: post.author ? {
            id: post.author._id,
            name: post.author.name,
            handle: post.author.slug.current,
            avatar: {
                src: authorImageUrl,
                alt: post.author.name,
                width: 200,
                height: 200,
            },
            description: post.author.bio || 'Local contributor sharing authentic Makkah experiences.',
        } : {
            id: 'local-guide',
            name: 'Local Guide',
            handle: 'local-guide',
            avatar: {
                src: '/images/avatar-placeholder.jpg',
                alt: 'Local Guide',
                width: 200,
                height: 200,
            },
            description: 'A local contributor sharing authentic experiences and insights about Makkah.',
        },
        categories: (post.categories || []).map(cat => ({
            id: cat._id,
            name: cat.title,
            handle: cat.slug.current,
            color: (cat.color || 'emerald') as any,
        })),
        tags: (post.tags || []).map(tag => ({
            id: tag._id,
            name: tag.title,
            handle: tag.slug.current,
            color: 'neutral' as any,
        })),
        // Content is stored as Sanity Portable Text
        content: post.body || [],
        // Additional fields for SEO
        updatedAt: post.updatedAt,
        seo: post.seo,
        // Gallery/video/audio placeholders (not used for standard posts)
        galleryImgs: [],
        videoUrl: undefined,
        audioUrl: undefined,
    }
}

/**
 * Get SEO metadata from Sanity post
 */
export function getPostSeoMeta(post: SanityPost) {
    const seo = post.seo || {}

    const ogImageUrl = seo.ogImage
        ? urlFor(seo.ogImage).width(1200).height(630).url()
        : post.featuredImage
            ? urlFor(post.featuredImage).width(1200).height(630).url()
            : null

    return {
        title: seo.metaTitle || post.title,
        description: seo.metaDescription || post.excerpt || '',
        keywords: seo.keywords || [],
        ogImage: ogImageUrl,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex || false,
    }
}
