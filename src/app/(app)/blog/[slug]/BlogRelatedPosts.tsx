import Link from 'next/link'
import Image from 'next/image'
import { TPost } from '@/data/posts'

interface Props {
    posts: TPost[]
}

export default function BlogRelatedPosts({ posts }: Props) {
    if (!posts || posts.length === 0) return null

    return (
        <section className="border-t border-neutral-100 py-8 dark:border-neutral-800">
            <div className="container">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        More Posts
                    </h2>
                    <Link
                        href="/blog"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                        View all
                    </Link>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {posts.slice(0, 4).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.handle}`}
                            className="group flex gap-3 rounded-lg border border-neutral-100 bg-white p-2 transition-colors hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                        >
                            {post.featuredImage && (
                                <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                                    <Image
                                        src={post.featuredImage.src}
                                        alt={post.featuredImage.alt}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                            )}
                            <div className="flex min-w-0 flex-col justify-center">
                                <h3 className="text-xs font-medium text-neutral-900 line-clamp-2 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                                    {post.title}
                                </h3>
                                {post.readingTime && (
                                    <p className="mt-1 text-[10px] text-neutral-400">
                                        {post.readingTime} min read
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
