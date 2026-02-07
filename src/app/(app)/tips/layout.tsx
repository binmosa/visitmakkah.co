import { redirect } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
    // Tips has been merged into Explore → Local Tips
    redirect('/explore/local-tips')
}
