import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Stay & Food',
    description: 'Find the best hotels near Masjid al-Haram and discover great dining options in Makkah.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Stay & Food"
            message="Ask our AI to find hotels by gate preference, discover restaurants for families, find late-night dining, or locate women-friendly areas."
        />
    )
}
