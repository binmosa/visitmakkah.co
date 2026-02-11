import Image from 'next/image'
import Link from 'next/link'

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
    const { title, date, readingTime, featuredImage, categories } = post

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <header className="border-b border-neutral-100 dark:border-neutral-800">
            <div className="container py-6">
                {/* Breadcrumb */}
                <nav className="mb-4 text-xs">
                    <ol className="flex items-center gap-1.5 text-neutral-400">
                        <li><Link href="/" className="hover:text-neutral-600 dark:hover:text-neutral-300">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/blog" className="hover:text-neutral-600 dark:hover:text-neutral-300">Blog</Link></li>
                    </ol>
                </nav>

                {/* Categories */}
                {categories && categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/blog?category=${cat.handle}`}
                                className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                    {title}
                </h1>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                    <time dateTime={date}>{formattedDate}</time>
                    {readingTime && (
                        <>
                            <span className="text-neutral-300 dark:text-neutral-600">·</span>
                            <span>{readingTime} min read</span>
                        </>
                    )}
                </div>

                {/* Featured Image - Smaller */}
                <div className="mt-5 overflow-hidden rounded-xl">
                    <div className="relative aspect-[2/1] max-h-[280px]">
                        <Image
                            src={featuredImage.src}
                            alt={featuredImage.alt}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}
