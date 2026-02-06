import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Prepare Your Journey | Visit Makkah',
    description: 'Build your itinerary, get visa guidance, pack your bag, and calculate your budget with AI-powered tools.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Prepare Your Journey"
            message="Use the AI assistant to create your personalized itinerary, get visa guidance, build a smart packing list, or estimate your trip costs."
        />
    )
}
