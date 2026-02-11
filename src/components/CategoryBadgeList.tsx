import { BadgeButton } from '@/shared/Badge'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
  itemClass?: string
  categories?: {
    name: string
    handle: string
    color?: string
  }[]
}

const CategoryBadgeList: FC<Props> = ({ className, itemClass, categories }) => {
  if (!categories || categories.length === 0) return null

  return (
    <div className={clsx('category-badge-list flex flex-wrap gap-x-2 gap-y-1', className)}>
      {categories.map((item, index) => (
        <BadgeButton className={itemClass} key={index} href={`/blog?category=${item.handle}`} color={(item.color || 'gray') as any}>
          {item.name}
        </BadgeButton>
      ))}
    </div>
  )
}

export default CategoryBadgeList
