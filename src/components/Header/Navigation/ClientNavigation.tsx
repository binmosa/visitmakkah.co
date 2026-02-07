'use client'

import { usePersonalizedNavigation } from '@/components/Providers/PersonalizedNavigationProvider'
import Navigation from './Navigation'

interface Props {
    className?: string
}

const ClientNavigation = ({ className }: Props) => {
    const { navigation, isLoading } = usePersonalizedNavigation()

    if (isLoading) {
        return (
            <nav className={className}>
                <div className="flex items-center gap-1">
                    {/* Skeleton loaders */}
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-10 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"
                        />
                    ))}
                </div>
            </nav>
        )
    }

    return <Navigation menu={navigation} className={className} />
}

export default ClientNavigation
