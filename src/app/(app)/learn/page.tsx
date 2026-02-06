import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Learn the Rituals | Visit Makkah',
    description: 'Complete guides for Umrah and Hajj rituals, step-by-step instructions, and essential duas and prayers.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Learn the Rituals"
            message="Ask the AI guide about Umrah or Hajj rituals, get step-by-step instructions for Tawaf and Sai, or learn the essential duas and prayers."
        />
    )
}
