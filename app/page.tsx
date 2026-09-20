import PrdTool from "@/components/PrdTool";
import LearnSection from "@/components/LearnSection";
import ThemeToggle from "@/components/ThemeToggle";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main>
      <header id="top" className="border-b border-line sticky top-0 bg-paper/80 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-semibold text-[15px]">
            <Logo />
            PRD Drafter
          </a>
          <div className="flex items-center gap-4">
            {/* Replace with your repo URL once it's pushed. Opens in a new tab so
                in-progress drafts in the tool below are never lost. */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-ink transition"
            >
              View source ↗
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Hero />
      <PrdTool />
      <LearnSection />

      <footer className="border-t border-line py-8">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-xs text-muted flex flex-wrap justify-between gap-3">
          <span>Built with ❤️ by Shiwani Thakur</span>
        </div>
      </footer>
    </main>
  );
}
