import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/shared/Avatar'

interface PostDetail {
    id: string
    title: string
    handle: string
    excerpt?: string
    date: string
    readingTime?: number
    featuredImage: {
        src: string
        alt: string
        width: number
        height: number
    }
    author: {
        id: string
        name: string
        handle: string
        avatar: { src: string; alt: string }
    }
    categories?: Array<{ id: string; name: string; handle: string }>
}

interface Props {
    post: PostDetail
}

export default function BlogPostHeader({ post }: Props) {
    const { title, excerpt, date, readingTime, featuredImage, author, categories } = post

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <header className="bg-neutral-50 dark:bg-neutral-900">
            <div className="container py-8 sm:py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center gap-2 text-neutral-500">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/blog" className="hover:text-primary-600">Blog</Link></li>
                        <li>/</li>
                        <li className="text-neutral-900 dark:text-white truncate max-w-[200px]">{title}</li>
                    </ol>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                    {/* Content */}
                    <div className="order-2 lg:order-1">
                        {/* Categories */}
                        {categories && categories.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/blog?category=${cat.handle}`}
                                        className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white">
                            {title}
                        </h1>

                        {/* Excerpt */}
                        {excerpt && (
                            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                                {excerpt}
                            </p>
                        )}

                        {/* Meta */}
                        <div className="mt-6 flex items-center gap-4">
                            <Link href={`/blog?author=${author.handle}`} className="flex items-center gap-3">
                                <Avatar src={author.avatar.src} className="size-10" />
                                <span className="font-medium text-neutral-900 dark:text-white">{author.name}</span>
                            </Link>
                            <span className="text-neutral-400">·</span>
                            <time className="text-neutral-500" dateTime={date}>{formattedDate}</time>
                            {readingTime && (
                                <>
                                    <span className="text-neutral-400">·</span>
                                    <span className="text-neutral-500">{readingTime} min read</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                            <Image
                                src={featuredImage.src}
                                alt={featuredImage.alt}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
