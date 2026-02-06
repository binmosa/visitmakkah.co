'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

// Custom components for Portable Text rendering
const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) {
                return null
            }
            return (
                <figure className="my-8">
                    <Image
                        src={urlFor(value).width(1200).url()}
                        alt={value.alt || 'Blog image'}
                        width={1200}
                        height={675}
                        className="rounded-2xl w-full"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                    />
                    {value.caption && (
                        <figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            )
        },
        callout: ({ value }) => {
            const bgColors: Record<string, string> = {
                info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
                warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
                tip: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
                note: 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700',
            }
            const type = value.type || 'note'
            return (
                <div className={`my-6 rounded-xl border p-4 ${bgColors[type] || bgColors.note}`}>
                    <PortableText value={value.content} components={components} />
                </div>
            )
        },
    },
    marks: {
        link: ({ children, value }) => {
            const rel = !value.href?.startsWith('/') ? 'noopener noreferrer' : undefined
            const target = !value.href?.startsWith('/') ? '_blank' : undefined
            return (
                <a href={value.href} rel={rel} target={target} className="text-emerald-600 hover:text-emerald-700 underline dark:text-emerald-400 dark:hover:text-emerald-300">
                    {children}
                </a>
            )
        },
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
                {children}
            </code>
        ),
    },
    block: {
        h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
        normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-emerald-500 pl-4 italic text-neutral-600 dark:text-neutral-300">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="my-4 list-disc pl-6 space-y-2">{children}</ul>,
        number: ({ children }) => <ol className="my-4 list-decimal pl-6 space-y-2">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
        number: ({ children }) => <li className="leading-relaxed">{children}</li>,
    },
}

interface SanityContentProps {
    content: any[]
    className?: string
}

export default function SanityContent({ content, className = '' }: SanityContentProps) {
    if (!content || content.length === 0) {
        return (
            <div className={className}>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Content coming soon...
                </p>
            </div>
        )
    }

    return (
        <div className={className}>
            <PortableText value={content} components={components} />
        </div>
    )
}
