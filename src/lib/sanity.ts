import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

// Sanity configuration
export const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
}

// Create the Sanity client
export const sanityClient = createClient(config)

// Preview client (no CDN, always fresh)
export const previewClient = createClient({
    ...config,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
})

// Get the right client based on preview mode
export const getClient = (preview = false) =>
    preview ? previewClient : sanityClient

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
    return builder.image(source)
}

// ============================================
// GROQ QUERIES
// ============================================

// Posts queries
export const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readingTime,
    featured,
    "author": author->{name, slug, image},
    "categories": categories[]->{title, slug}
}`

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    featuredImage,
    publishedAt,
    updatedAt,
    readingTime,
    seo,
    "author": author->{name, slug, image, bio, role, credentials},
    "categories": categories[]->{title, slug},
    "tags": tags[]->{title, slug}
}`

export const featuredPostsQuery = `*[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    "author": author->{name, image}
}`

export const postsByCategoryQuery = `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    readingTime,
    "author": author->{name, slug, image}
}`

// Guides queries
export const guidesQuery = `*[_type == "guide"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    guideType,
    difficulty,
    excerpt,
    featuredImage,
    estimatedTime,
    "author": author->{name, slug, image}
}`

export const guideBySlugQuery = `*[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    guideType,
    difficulty,
    excerpt,
    featuredImage,
    introduction,
    steps,
    conclusion,
    faqs,
    estimatedTime,
    publishedAt,
    updatedAt,
    seo,
    "author": author->{name, slug, image, bio, role, credentials}
}`

export const guidesByTypeQuery = `*[_type == "guide" && guideType == $type] | order(publishedAt desc) {
    _id,
    title,
    slug,
    guideType,
    difficulty,
    excerpt,
    featuredImage,
    estimatedTime
}`

// FAQ queries
export const faqsQuery = `*[_type == "faq"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    category,
    description,
    "questionCount": count(questions)
}`

export const faqBySlugQuery = `*[_type == "faq" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    description,
    questions,
    seo
}`

// Categories & Tags
export const categoriesQuery = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color
}`

export const tagsQuery = `*[_type == "tag"] | order(title asc) {
    _id,
    title,
    slug
}`

// Authors
export const authorsQuery = `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    role,
    bio
}`

export const authorBySlugQuery = `*[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    role,
    credentials,
    social
}`

// ============================================
// FETCH HELPERS
// ============================================

export async function getAllPosts() {
    return sanityClient.fetch(postsQuery)
}

export async function getPostBySlug(slug: string) {
    return sanityClient.fetch(postBySlugQuery, { slug })
}

export async function getFeaturedPosts() {
    return sanityClient.fetch(featuredPostsQuery)
}

export async function getPostsByCategory(categorySlug: string) {
    return sanityClient.fetch(postsByCategoryQuery, { categorySlug })
}

export async function getAllGuides() {
    return sanityClient.fetch(guidesQuery)
}

export async function getGuideBySlug(slug: string) {
    return sanityClient.fetch(guideBySlugQuery, { slug })
}

export async function getGuidesByType(type: string) {
    return sanityClient.fetch(guidesByTypeQuery, { type })
}

export async function getAllFaqs() {
    return sanityClient.fetch(faqsQuery)
}

export async function getFaqBySlug(slug: string) {
    return sanityClient.fetch(faqBySlugQuery, { slug })
}

export async function getAllCategories() {
    return sanityClient.fetch(categoriesQuery)
}

export async function getAllTags() {
    return sanityClient.fetch(tagsQuery)
}

export async function getAuthorBySlug(slug: string) {
    return sanityClient.fetch(authorBySlugQuery, { slug })
}

// ============================================
// SITEMAP HELPERS
// ============================================

export async function getAllSlugsForSitemap() {
    const query = `{
        "posts": *[_type == "post" && defined(slug.current)].slug.current,
        "guides": *[_type == "guide" && defined(slug.current)].slug.current,
        "faqs": *[_type == "faq" && defined(slug.current)].slug.current,
        "categories": *[_type == "category" && defined(slug.current)].slug.current
    }`
    return sanityClient.fetch(query)
}
