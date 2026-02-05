import BackgroundSection from '@/components/BackgroundSection'
import SectionHero from '@/components/SectionHero'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import { getAllPosts } from '@/data/posts'
import rightImg from '@/images/hero-right.png'
import React from 'react'

const Page = async () => {
    const posts = await getAllPosts()

    return (
        <div className="space-y-16 lg:space-y-24">


            <div className="relative py-16">
                data container here to show the selected menu item output here
            </div>
        </div>
    )
}

export default Page
