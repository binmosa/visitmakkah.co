'use client'

import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Tag from '@/shared/Tag'
import { Link } from '@/shared/link'
import SanityContent from '@/components/SanityContent'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { ArrowUp02Icon, Share01Icon, MessageMultiple02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface PostDetail {
    id: string
    title: string
    handle: string
    content: any[]
    tags: Array<{ id: string; name: string; handle: string }>
    author: {
        id: string
        name: string
        handle: string
        avatar: { src: string; alt: string }
        description?: string
    }
}

interface Props {
    post: PostDetail
    className?: string
}

const BlogPostContent: FC<Props> = ({ post, className }) => {
    const endedAnchorRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLButtonElement>(null)
    const [isShowScrollToTop, setIsShowScrollToTop] = useState<boolean>(false)

    const { tags, author, content, handle } = post

    const endedAnchorEntry = useIntersectionObserver(endedAnchorRef, {
        threshold: 0,
        root: null,
        rootMargin: '0%',
        freezeOnceVisible: false,
    })

    useEffect(() => {
        const handleProgressIndicator = () => {
            const entryContent = contentRef.current
            const progressBarContent = progressRef.current

            if (!entryContent || !progressBarContent) {
                return
            }

            const winScroll = window.scrollY || document.documentElement.scrollTop
            const entryContentRect = entryContent.getBoundingClientRect()
            const entryContentTop = entryContentRect.top
            const entryContentHeight = entryContentRect.height

            const totalEntryH = entryContentTop + window.scrollY + entryContentHeight
            const scrolled = (winScroll / totalEntryH) * 100

            progressBarContent.innerText = scrolled.toFixed(0) + '%'

            if (scrolled >= 100) {
                setIsShowScrollToTop(true)
            } else {
                setIsShowScrollToTop(false)
            }
        }

        const handleProgressIndicatorHeadeEvent = () => {
            window?.requestAnimationFrame(handleProgressIndicator)
        }
        handleProgressIndicator()
        window?.addEventListener('scroll', handleProgressIndicatorHeadeEvent)
        return () => {
            window?.removeEventListener('scroll', handleProgressIndicatorHeadeEvent)
        }
    }, [])

    const showLikeAndCommentSticky =
        !endedAnchorEntry?.intersectionRatio && (endedAnchorEntry?.boundingClientRect.top || 0) > 0

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url: window.location.href,
                })
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
        }
    }

    return (
        <div className={`relative ${className}`}>
            <div className="single-content space-y-10">
                {/* ENTRY CONTENT - Using Sanity Portable Text */}
                <div
                    id="single-entry-content"
                    className="mx-auto prose max-w-(--breakpoint-md)! lg:prose-lg dark:prose-invert"
                    ref={contentRef}
                >
                    <SanityContent content={content} />
                </div>

                {/* TAGS */}
                {tags && tags.length > 0 && (
                    <div className="mx-auto flex max-w-(--breakpoint-md) flex-wrap">
                        {tags.map((tag) => (
                            <Tag key={tag.id} className="me-2 mb-2" href={`/blog?tag=${tag.handle}`}>
                                {tag.name}
                            </Tag>
                        ))}
                    </div>
                )}

                {/* AUTHOR */}
                <div className="mx-auto max-w-(--breakpoint-md) border-t border-neutral-100 pt-6 dark:border-neutral-800">
                    <div className="flex items-start gap-3">
                        <Image
                            src="/logos/icon.svg"
                            alt="Visit Makkah"
                            width={40}
                            height={40}
                            className="size-10 rounded-lg"
                        />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-400">Written by</p>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Local Guide</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {author.description || 'Local contributor sharing authentic experiences and insights about Makkah.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI TRIP PLANNER CTA */}
                <div className="mx-auto max-w-(--breakpoint-md) rounded-xl border border-primary-100 bg-primary-50/50 p-5 dark:border-primary-900/30 dark:bg-primary-900/10">
                    <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <HugeiconsIcon icon={MessageMultiple02Icon} className="size-5 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                Plan Your Journey
                            </h3>
                            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                Get personalized guidance for your pilgrimage with our AI trip planner.
                            </p>
                            <Link
                                href="/prepare"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
                            >
                                Start Planning
                            </Link>
                        </div>
                    </div>
                </div>

                <div ref={endedAnchorRef}></div>
            </div>

            {/* PROGRESS AND SHARE STICKY */}
            <div className={`sticky bottom-8 z-11 mt-8 justify-center ${showLikeAndCommentSticky ? 'flex' : 'hidden'}`}>
                <div className="flex items-center justify-center gap-x-2 rounded-full bg-white p-1.5 text-xs shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/20">
                    <button
                        onClick={handleShare}
                        className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
                        title="Share"
                    >
                        <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={1.75} />
                    </button>

                    <div className="h-4 border-s border-neutral-200 dark:border-neutral-700"></div>

                    <button
                        className={`size-8.5 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20 ${
                            isShowScrollToTop ? 'flex' : 'hidden'
                        }`}
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        title="Go to top"
                    >
                        <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={1.75} />
                    </button>

                    <button
                        ref={progressRef}
                        className={`size-8.5 items-center justify-center ${isShowScrollToTop ? 'hidden' : 'flex'}`}
                        title="Reading progress"
                    >
                        %
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BlogPostContent
