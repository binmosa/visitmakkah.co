import BackgroundSection from '@/components/BackgroundSection'
import SectionAds from '@/components/SectionAds'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionGridPosts from '@/components/SectionGridPosts'
import SectionHero from '@/components/SectionHero'
import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionMagazine1 from '@/components/SectionMagazine1'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine7 from '@/components/SectionMagazine7'
import SectionMagazine8 from '@/components/SectionMagazine8'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionPostsWithWidgets from '@/components/SectionPostsWithWidgets'
import SectionSliderNewAuthors from '@/components/SectionSliderNewAuthors'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import SectionVideos from '@/components/SectionVideos'
import { getAuthors } from '@/data/authors'
import { getCategories } from '@/data/categories'
import { getAllPosts, getPostsAudio, getPostsGallery, getPostsVideo } from '@/data/posts'
import Vector1 from '@/images/Vector1.png'
import rightImg from '@/images/hero-right.png'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page of the application showcasing various sections and posts.',
}

const Page = async () => {
  const posts = await getAllPosts()
  const audioPosts = await getPostsAudio()
  const videoPosts = await getPostsVideo()
  const galleryPosts = await getPostsGallery()
  const authors = await getAuthors()
  const categories = await getCategories()

  return (
    <div className="relative pb-28 lg:pb-32">
      <div className="relative container space-y-28 lg:space-y-32">

        {/* 1. Hero = Command Center Big AI field: Ask anything about your Umrah
3 buttons only:
Plan My Umrah
Navigate Haram
Find Hotels
*/}

        <SectionHero
          rightImg={rightImg}
          className="pt-14 lg:pt-20"
          heading={
            <span>
              Far from face <br /> but not from {` `}
              <span className="relative pr-3">
                <Image className="absolute -start-1 top-1/2 w-full -translate-y-1/2" src={Vector1} alt="hero-right" />
                <span className="relative">heart</span>
              </span>
            </span>
          }
          btnText="Getting started"
          subHeading="Let stay at home and share with everyone the most beautiful stories in your hometown 🎈"
        />

        {/* 2. Live Status Panel 
Real-time info immediately:
Next Prayer
Crowd Level
Weather
Tawaf Recommendation
*/}


        <SectionSliderNewCategories
          heading="2 Live Status Panel"
          categoryCardType="card5"
          subHeading="get real-time info updates"
          categories={categories.filter((_, i) => i < 10)}
        />

        {/* 3. Start With Your Situation 
Tiles:
First Time Visitor
Woman Traveler
Family
Elderly
Hajj
Umrah
AI auto-configures guidance.
*/}
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <SectionSliderNewAuthors
            heading="3. Start With Your Situation"
            subHeading="Quickly get started with your makkah journey"
            authors={authors.slice(0, 10)}
          />
        </div>

        {/* 4. Smart Tools 
Smart Tools (Top 4 Only)
AI Trip Planner
Haram Map
Prayer Planner
Budget Tool
*/}

        <SectionSliderNewCategories
          heading="4. Smart Tools"
          subHeading="Help you plan your journey"
          categories={categories.slice(0, 10)}
          categoryCardType="card4"
        />

        <SectionAds />



        {/* 5. Local Tips Today
Local Tips Today”
AI rotates:
crowd avoidance
food hacks
taxi tips
*/}
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <SectionSliderPosts
            postCardName="card10V2"
            heading="5 Local Tips Today"
            subHeading="Get local tips for your journey"
            posts={posts.slice(0, 6)}
          />
        </div>






      </div>



      {/* <div className="container space-y-28 lg:space-y-32">
      </div> */}





    </div>
  )
}

export default Page
