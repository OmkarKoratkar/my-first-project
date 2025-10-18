import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";

const font = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "V.E.D. — Virtual Emotional Dashboard",
  description: "A futuristic control center for your AI assistant's emotional state and operations."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-background text-foreground", font.variable, "font-sans")}>
        <div className="flex min-h-screen">
          <Sidebar variant="desktop" />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto bg-transparent px-6 py-8">
              <div className="mx-auto w-full max-w-6xl space-y-8 pb-16">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
