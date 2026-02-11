import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Explore Makkah | Visit Makkah',
    description: 'Find hotels near Haram gates, discover restaurants, and navigate to the Holy Mosque.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Explore Makkah"
            message="Ask the AI guide to find hotels near specific gates, discover restaurants and cafes, or get navigation directions to the Haram."
        />
    )
}
