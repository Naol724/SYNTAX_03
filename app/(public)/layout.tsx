import dynamic from "next/dynamic"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const ChatWidget = dynamic(() => import("@/components/ai/ChatWidget"), {
  ssr: false,
  loading: () => null,
})

/**
 * Public pages share one Navbar + one Footer.
 * Heavy widgets (chat) load after paint; background kept CSS-only and light.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Lightweight static atmosphere — no JS animation work on navigation */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-gray-50 via-blue-50/25 to-indigo-50/30 dark:from-gray-950 dark:via-blue-950/15 dark:to-indigo-950/20" />
      <ChatWidget />
      <div className="relative min-h-screen flex flex-col isolate">
        <Navbar />
        <main className="flex-1 relative z-10 pb-16 sm:pb-0">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
