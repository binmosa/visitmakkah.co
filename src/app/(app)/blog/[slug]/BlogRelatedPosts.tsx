import Link from 'next/link'
import Image from 'next/image'
import { TPost } from '@/data/posts'

interface Props {
    posts: TPost[]
}

export default function BlogRelatedPosts({ posts }: Props) {
    if (!posts || posts.length === 0) return null

    return (
        <section className="border-t border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="container">
                <h2 className="mb-8 text-xl font-bold text-neutral-900 dark:text-white">
                    Related Articles
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.handle}`}
                            className="group block overflow-hidden rounded-xl bg-white dark:bg-neutral-800"
                        >
                            {post.featuredImage && (
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={post.featuredImage.src}
                                        alt={post.featuredImage.alt}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2 dark:text-neutral-400">
                                        {post.excerpt}
                                    </p>
                                )}
                                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                                    {post.author && <span>{post.author.name}</span>}
                                    {post.readingTime && (
                                        <>
                                            <span>·</span>
                                            <span>{post.readingTime} min read</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                    >
                        View All Articles
                    </Link>
                </div>
            </div>
        </section>
    )
}
