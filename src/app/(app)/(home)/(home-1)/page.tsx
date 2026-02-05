import HomePageWrapper from '@/components/Home/HomePageWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Visit Makkah - Your AI-Powered Pilgrimage Guide',
    description: 'Your personalized AI guide for Hajj and Umrah. Plan your journey, learn rituals, find accommodations, and get real-time guidance.',
}

const Page = () => {
    return <HomePageWrapper />
}

export default Page
