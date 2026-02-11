'use client'

import { TPost } from '@/data/posts'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useState } from 'react'
import CategoryBadgeList from '@/components/CategoryBadgeList'
import PostCardCommentBtn from '@/components/PostCardCommentBtn'
import PostCardLikeBtn from '@/components/PostCardLikeBtn'
import PostCardSaveBtn from '@/components/PostCardSaveBtn'
import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'

interface Props {
    className?: string
    post: TPost
    ratio?: string
    hiddenAuthor?: boolean
}

const BlogCard: FC<Props> = ({ className, post, hiddenAuthor = false, ratio = 'aspect-4/3' }) => {
    const { title, handle, categories, date, likeCount, liked, commentCount, readingTime, bookmarked } = post

    const [isHover, setIsHover] = useState(false)

    return (
        <div
            className={clsx('group post-card-11 relative flex flex-col rounded-2xl bg-white sm:rounded-3xl dark:bg-white/5', className)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className={clsx('relative block w-full shrink-0 overflow-hidden rounded-t-2xl sm:rounded-t-3xl', ratio)}>
                <PostFeaturedMedia post={post} isHover={isHover} />
            </div>
            {/* Categories - hidden on mobile for cleaner look */}
            <div className="absolute inset-x-2 top-2 hidden sm:inset-x-3 sm:top-3 sm:block">
                <CategoryBadgeList categories={categories} />
            </div>

            <div className="flex grow flex-col gap-y-1.5 rounded-b-2xl border p-2.5 sm:gap-y-3 sm:rounded-b-3xl sm:p-4">
                {!hiddenAuthor ? <PostCardMeta meta={post} /> : <span className="text-[10px] text-neutral-500 sm:text-xs">{date}</span>}
                <h3 className="nc-card-title block text-xs font-semibold text-neutral-900 sm:text-base dark:text-neutral-100">
                    <Link href={`/blog/${handle}`} className="line-clamp-2" title={title}>
                        {title}
                    </Link>
                </h3>

                {/* Action buttons - hidden on mobile */}
                <div className="mt-auto hidden flex-wrap gap-x-2 gap-y-1 sm:flex">
                    <PostCardLikeBtn likeCount={likeCount} liked={liked} />
                    <PostCardCommentBtn commentCount={commentCount} handle={handle} />
                    <PostCardSaveBtn className="ms-auto" readingTime={readingTime} bookmarked={bookmarked} />
                </div>
            </div>
        </div>
    )
}

export default BlogCard
