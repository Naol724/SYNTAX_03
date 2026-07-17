import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { PageLoader } from "@/components/ui/page-loader"
import { AnimatedBackground } from "@/components/ui/animated-background"
import ChatWidget from "@/components/ai/ChatWidget"

/**
 * Public pages share one Navbar + one Footer.
 * Footer is transparent glass (no photo) and identical on every page.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <PageLoader />
      <ChatWidget />
      <div className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 relative z-10 pb-16 sm:pb-0">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
