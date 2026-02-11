import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import { sanityPostToPostDetail, sanityPostToTPost, getPostSeoMeta } from '@/lib/sanity-adapters'
import BlogPostContent from './BlogPostContent'
import BlogPostHeader from './BlogPostHeader'
import BlogRelatedPosts from './BlogRelatedPosts'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) {
        return {
            title: 'Post not found | Visit Makkah Blog',
            description: 'The requested blog post could not be found.',
        }
    }

    const seo = getPostSeoMeta(post)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://visitmakkah.com'

    return {
        title: `${seo.title} | Visit Makkah Blog`,
        description: seo.description,
        keywords: seo.keywords,
        authors: post.author ? [{ name: post.author.name }] : undefined,
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: 'article',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: post.author?.name,
            images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
            url: `${baseUrl}/blog/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
            images: seo.ogImage ? [seo.ogImage] : undefined,
        },
        alternates: {
            canonical: seo.canonicalUrl || `${baseUrl}/blog/${slug}`,
        },
        robots: seo.noIndex ? { index: false, follow: false } : undefined,
    }
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
    const posts = await getAllPosts()
    return (posts || []).map((post: any) => ({
        slug: post.slug?.current || '',
    })).filter((p: { slug: string }) => p.slug)
}

// Revalidate every hour
export const revalidate = 3600

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    // Transform to component format
    const postDetail = sanityPostToPostDetail(post)

    // Get related posts (same category or recent)
    const allPosts = await getAllPosts()
    const relatedPosts = (allPosts || [])
        .filter((p: any) => p._id !== post._id)
        .slice(0, 6)
        .map((p: any, i: number) => sanityPostToTPost(p, i))

    // JSON-LD structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        image: postDetail.featuredImage.src,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
            '@type': 'Person',
            name: postDetail.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Visit Makkah',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visitmakkah.com'}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://visitmakkah.com'}/blog/${slug}`,
        },
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="blog-post">
                <BlogPostHeader post={postDetail} />

                <div className="container py-10">
                    <BlogPostContent post={postDetail} />
                </div>

                {relatedPosts.length > 0 && (
                    <BlogRelatedPosts posts={relatedPosts} />
                )}
            </article>
        </>
    )
}
