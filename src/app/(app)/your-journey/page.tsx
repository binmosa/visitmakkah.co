import BackgroundSection from '@/components/BackgroundSection'
import SectionHero from '@/components/SectionHero'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import { getAllPosts } from '@/data/posts'
import rightImg from '@/images/hero-right-2.png' // Using a different image if available, or fallback
import React from 'react'

const Page = async () => {
    const posts = await getAllPosts()

    return (
        <div className="space-y-16 lg:space-y-24">

            <div className="relative py-16">
                <BackgroundSection />
                data container here to show the selected menu item output here
            </div>
        </div>
    )
}

export default Page
