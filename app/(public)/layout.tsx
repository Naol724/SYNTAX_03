import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { PageLoader } from "@/components/ui/page-loader"
import { AnimatedBackground } from "@/components/ui/animated-background"
import ChatWidget from "@/components/ai/ChatWidget"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <PageLoader />
      <ChatWidget />
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </>
  )
}
