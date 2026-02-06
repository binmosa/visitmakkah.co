import { AudioProvider } from '@/components/AudioProvider'
import Aside from '@/components/aside'
import { AudioPlayer } from '@/components/audio-player/AudioPlayer'
import { UserJourneyProvider } from '@/context/UserJourneyContext'
import { DataCollectionProvider } from '@/components/Providers/DataCollectionProvider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserJourneyProvider>
      <DataCollectionProvider>
        <AudioProvider>
          <Aside.Provider>{children}</Aside.Provider>
          <div className="fixed inset-x-0 bottom-0 z-20">
            <AudioPlayer />
          </div>
        </AudioProvider>
      </DataCollectionProvider>
    </UserJourneyProvider>
  )
}

export default Layout
