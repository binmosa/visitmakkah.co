import { TCategory } from '@/data/categories'
import { News01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const BlogPageHeader = ({
    category,
}: {
    category: TCategory
}) => {
    const { description, count } = category

    return (
        <div className="container py-6 sm:py-8">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-3 shadow-lg shadow-primary-500/20">
                    <HugeiconsIcon icon={News01Icon} className="size-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">
                        Blog
                    </h1>
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                        {description || 'Local insights and guides for your pilgrimage'}
                    </p>
                </div>
            </div>
            {count && count > 0 && (
                <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {count} article{count !== 1 ? 's' : ''}
                    </span>
                </div>
            )}
        </div>
    )
}

export default BlogPageHeader
