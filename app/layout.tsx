import type { Metadata } from "next";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import MobileDock from "@/components/MobileDock";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Psych Grind | 120 → 75",
  description: "Gamified Psychology of Learning MCQ trainer for the NPTEL/SWAYAM question pool.",
  icons: { icon: "/bolt.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AnimatedBackground />
          <Navbar />
          <MobileDock />
          <main className="min-h-[calc(100vh-64px)] px-4 sm:px-6">{children}</main>
          <footer className="mx-auto mb-20 max-w-7xl border-t border-white/5 px-4 py-8 text-center text-xs text-zinc-700 sm:px-6 md:mb-0">
            <p>Built to memorize the pool, not to make psychology your personality.</p>
            <p className="mt-2">
              Made with <span aria-label="love" role="img">❤️</span> by{" "}
              <a
                href="https://github.com/CallMeChandler"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-zinc-500 transition hover:text-violet-300"
              >
                CallMeChandler
              </a>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
