import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { DropZone } from "@/components/ui/DropZone";
import { RecentList } from "@/components/ui/RecentList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-accent selection:text-black">
      <Header />

      <main className="flex-1 flex flex-col relative pb-8">
        {/* Main Drop Zone Area */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 gap-12">
          <DropZone />
          <RecentList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
