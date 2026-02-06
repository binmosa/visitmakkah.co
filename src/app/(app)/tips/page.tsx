import HubContentPlaceholder from '@/components/HubContentPlaceholder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Insider Tips | Visit Makkah',
    description: 'Essential tips for first-timers, women travelers, Ramadan visits, and secret shortcuts known only to locals.',
}

export default function Page() {
    return (
        <HubContentPlaceholder
            title="Insider Tips"
            message="Ask the AI guide for first-timer tips, women-specific guidance, Ramadan visit advice, or discover secret shortcuts and insider routes."
        />
    )
}
