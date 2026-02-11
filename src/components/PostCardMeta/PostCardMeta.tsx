import { TPost } from '@/data/posts'
import clsx from 'clsx'
import Image from 'next/image'
import { FC } from 'react'
import LocalDate from '../LocalDate'

interface Props {
  className?: string
  meta: Pick<TPost, 'date' | 'author'>
  hiddenAvatar?: boolean
  avatarSize?: string
}

const PostCardMeta: FC<Props> = ({ className, meta, hiddenAvatar = false, avatarSize = 'size-5 sm:size-6' }) => {
  const { date } = meta

  return (
    <div className={clsx('post-card-meta flex flex-wrap items-center text-[10px] sm:text-xs', className)}>
      <div className="flex items-center gap-x-1.5 sm:gap-x-2">
        {!hiddenAvatar && (
          <Image
            src="/logos/icon.svg"
            alt="Visit Makkah"
            width={24}
            height={24}
            className={clsx('hidden rounded sm:block', avatarSize)}
          />
        )}
        <span className="block font-medium text-neutral-600 sm:text-neutral-700 dark:text-neutral-400 sm:dark:text-neutral-300">Local Guide</span>
      </div>
      <span className="mx-1 text-neutral-300 sm:mx-1.5 dark:text-neutral-600">·</span>
      <span className="font-normal text-neutral-400 sm:text-neutral-500 dark:text-neutral-500 sm:dark:text-neutral-400">
        <LocalDate date={date} />
      </span>
    </div>
  )
}

export default PostCardMeta
