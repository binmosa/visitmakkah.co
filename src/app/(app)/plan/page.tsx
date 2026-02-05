import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Plan Your Journey',
    description: 'Plan your Hajj or Umrah journey with AI-powered tools for timeline, visa, packing, and transport.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Plan Your Journey"
            message="Use the AI assistant to create your personalized travel timeline, check visa requirements, build a packing list, or plan your transport."
        />
    )
}
