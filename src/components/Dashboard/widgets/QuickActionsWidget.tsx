'use client'

import Link from 'next/link'
import {
    Calendar03Icon,
    Mosque01Icon,
    Building03Icon,
    Settings03Icon,
    Idea01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface QuickAction {
    label: string
    description: string
    href: string
    icon: typeof Calendar03Icon
    color: string
}

const quickActions: QuickAction[] = [
    {
        label: 'Plan',
        description: 'Timeline & visa',
        href: '/plan',
        icon: Calendar03Icon,
        color: 'from-blue-500 to-blue-600',
    },
    {
        label: 'Your Journey',
        description: 'Hajj & Umrah guides',
        href: '/your-journey',
        icon: Mosque01Icon,
        color: 'from-primary-500 to-primary-600',
    },
    {
        label: 'Stay & Food',
        description: 'Hotels & restaurants',
        href: '/stay-and-food',
        icon: Building03Icon,
        color: 'from-orange-500 to-orange-600',
    },
    {
        label: 'Smart Tools',
        description: 'AI-powered helpers',
        href: '/smart-tools',
        icon: Settings03Icon,
        color: 'from-purple-500 to-purple-600',
    },
    {
        label: 'Local Tips',
        description: 'Insider knowledge',
        href: '/local-tips',
        icon: Idea01Icon,
        color: 'from-yellow-500 to-yellow-600',
    },
]

export default function QuickActionsWidget() {
    return (
        <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                EXPLORE
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary-600"
                    >
                        <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${action.color} p-2.5 shadow-lg`}>
                            <HugeiconsIcon icon={action.icon} className="size-5 text-white" />
                        </div>
                        <p className="font-semibold text-neutral-900 dark:text-white">{action.label}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{action.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
