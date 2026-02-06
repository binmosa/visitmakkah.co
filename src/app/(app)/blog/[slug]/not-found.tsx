import { Link } from '@/shared/link'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Mosque01Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function NotFound() {
    return (
        <div className="container py-20">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <HugeiconsIcon icon={Mosque01Icon} className="size-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Article Not Found
                </h1>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400">
                    The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
                    Explore our other local insights and experiences.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <ButtonPrimary href="/blog">
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} className="mr-2" />
                        Browse All Articles
                    </ButtonPrimary>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
