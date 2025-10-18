"use client";

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-[#080a15]/80 px-6 py-4 backdrop-blur",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <button
          className="inline-flex items-center justify-center rounded-lg border border-border/40 bg-[#0f1323]/70 p-2 text-muted-foreground transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary sm:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-lg font-semibold tracking-wide">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>V.E.D. — Virtual Emotional Dashboard</span>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-72 max-w-full bg-[#080b18] p-4 shadow-xl">
            <Sidebar variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
        <Link
          href="https://openai.com"
          className="rounded-full border border-border/50 bg-[#0f1323]/70 px-3 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground transition hover:text-primary"
        >
          Neural Sync
        </Link>
        <div className="flex h-2 w-2 animate-pulse items-center justify-center rounded-full bg-primary" />
      </div>
    </header>
  );
};
