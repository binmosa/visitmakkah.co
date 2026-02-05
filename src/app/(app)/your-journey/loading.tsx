import React from 'react'

export default function Loading() {
    return (
        <div className="container py-20 space-y-10">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        </div>
    )
}
