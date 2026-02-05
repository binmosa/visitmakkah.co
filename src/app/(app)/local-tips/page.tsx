import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Local Tips',
    description: 'Insider knowledge for navigating Makkah like a local - seasonal hacks, crowd tips, and hidden routes.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Local Tips"
            message="Get insider knowledge on seasonal hacks, Ramadan advice, Hajj crowd patterns, and secret routes known only to locals."
        />
    )
}
