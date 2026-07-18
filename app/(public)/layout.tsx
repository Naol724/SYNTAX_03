import dynamic from "next/dynamic"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { PageLoader } from "@/components/ui/page-loader"
import { AnimatedBackground } from "@/components/ui/animated-background"

const ChatWidget = dynamic(() => import("@/components/ai/ChatWidget"), {
  ssr: false,
  loading: () => null,
})

/**
 * Public pages share one Navbar + one Footer.
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
