import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Smart Tools',
    description: 'AI-powered tools to plan your trip, manage budget, create packing lists, and calculate distances.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Smart Tools"
            message="Access AI-powered tools for trip planning, budget management, packing checklists, and distance calculations to key locations."
        />
    )
}
