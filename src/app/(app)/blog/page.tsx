import { Metadata } from 'next'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/sanity'
import { createBlogCategory, sanityPostToTPost } from '@/lib/sanity-adapters'
import { TPost } from '@/data/posts'
import BlogPageHeader from './BlogPageHeader'
import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import BlogCard from './BlogCard'

export const metadata: Metadata = {
    title: 'Local Insights Blog | Visit Makkah',
    description: 'Real experiences and insider knowledge from locals who know Makkah. Get authentic tips, hidden gems, and practical advice for your pilgrimage journey.',
    keywords: ['Makkah blog', 'Hajj tips', 'Umrah guide', 'local insights', 'pilgrimage advice', 'Makkah travel'],
    openGraph: {
        title: 'Local Insights Blog | Visit Makkah',
        description: 'Real experiences and insider knowledge from locals who know Makkah.',
        type: 'website',
    },
}

// Revalidate every hour for fresh content
export const revalidate = 3600

const BlogPage = async () => {
    // Fetch data from Sanity
    const [sanityPosts, sanityCategories, sanityTags] = await Promise.all([
        getAllPosts(),
        getAllCategories(),
        getAllTags(),
    ])

    // Transform to existing component format
    const blogCategory = createBlogCategory(sanityPosts || [])
    const posts: TPost[] = (sanityPosts || []).map((post: any, index: number) => sanityPostToTPost(post, index))

    // Transform categories and tags for filter modals
    const categories = (sanityCategories || []).map((cat: any) => ({
        id: cat._id,
        name: cat.title,
        handle: cat.slug?.current || 'uncategorized',
        color: cat.color || 'emerald',
        count: 0,
        description: cat.description || '',
        thumbnail: {
            src: '/images/placeholder.jpg',
            alt: cat.title,
            width: 400,
            height: 400,
        },
    }))

    const tags = (sanityTags || []).map((tag: any) => ({
        id: tag._id,
        name: tag.title,
        handle: tag.slug?.current || tag.title.toLowerCase(),
        color: 'neutral',
        count: 0,
    }))

    const filterOptions = [
        { name: 'Most recent', value: 'most-recent' },
        { name: 'Featured first', value: 'featured' },
        { name: 'Most read', value: 'most-read' },
    ]

    return (
        <div className="page-blog">
            <BlogPageHeader category={blogCategory} />

            <div className="container pb-10 lg:pb-16">
                <div className="flex flex-wrap gap-x-2 gap-y-4">
                    {categories.length > 0 && <ModalCategories categories={categories} />}
                    {tags.length > 0 && <ModalTags tags={tags} />}
                    <div className="ms-auto">
                        <ArchiveSortByListBox filterOptions={filterOptions} />
                    </div>
                </div>

                {/* POSTS GRID */}
                {posts.length > 0 ? (
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-7 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-16 text-center">
                        <div className="mx-auto max-w-md">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                Coming Soon
                            </h3>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                                We&apos;re working on bringing you authentic local insights and experiences.
                                Check back soon for insider tips from people who know Makkah best.
                            </p>
                        </div>
                    </div>
                )}

                {/* PAGINATION */}
                {posts.length > 12 && <PaginationWrapper className="mt-20" />}
            </div>
        </div>
    )
}

export default BlogPage
