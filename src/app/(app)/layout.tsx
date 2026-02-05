import { AudioProvider } from '@/components/AudioProvider'
import Aside from '@/components/aside'
import { AudioPlayer } from '@/components/audio-player/AudioPlayer'
import { UserJourneyProvider } from '@/context/UserJourneyContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserJourneyProvider>
      <AudioProvider>
        <Aside.Provider>{children}</Aside.Provider>
        <div className="fixed inset-x-0 bottom-0 z-20">
          <AudioPlayer />
        </div>
      </AudioProvider>
    </UserJourneyProvider>
  )
}

export default Layout
