import { AudioProvider } from '@/components/AudioProvider'
import Aside from '@/components/aside'
import { AudioPlayer } from '@/components/audio-player/AudioPlayer'
import { UserJourneyProvider } from '@/context/UserJourneyContext'
import { DataCollectionProvider } from '@/components/Providers/DataCollectionProvider'
import { PersonalizedNavigationProvider } from '@/components/Providers/PersonalizedNavigationProvider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserJourneyProvider>
      <PersonalizedNavigationProvider>
        <DataCollectionProvider>
          <AudioProvider>
            <div className="islamic-pattern-page min-h-screen">
              <Aside.Provider>{children}</Aside.Provider>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-20">
              <AudioPlayer />
            </div>
          </AudioProvider>
        </DataCollectionProvider>
      </PersonalizedNavigationProvider>
    </UserJourneyProvider>
  )
}

export default Layout
