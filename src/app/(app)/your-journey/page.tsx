import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Journey',
    description: 'Complete guides for Hajj, Umrah, rituals, and spiritual preparation.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Your Spiritual Journey"
            message="Get comprehensive guidance on Hajj and Umrah rituals, spiritual preparation, and step-by-step instructions from our AI guide."
        />
    )
}
