"use client";

import { Brain, CheckCircle2, Theater, Settings2, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Memory", href: "/memory", icon: Brain, emoji: "🧠" },
  { name: "Tasks", href: "/tasks", icon: CheckCircle2, emoji: "✅" },
  { name: "Personality", href: "/personality", icon: Theater, emoji: "🎭" },
  { name: "Config", href: "/config", icon: Settings2, emoji: "⚙️" },
  { name: "Transcript", href: "/transcript", icon: NotebookPen, emoji: "🗒️" }
];

interface SidebarProps {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, variant = "desktop", className }) => {
  const pathname = usePathname();
  const variantClasses =
    variant === "desktop" ? "hidden w-0 border-r sm:flex sm:w-64" : "flex w-full border border-border/60";

  return (
    <aside
      className={cn(
        variantClasses,
        "h-full flex-col bg-[#080b18]/80 p-4 text-sm backdrop-blur",
        variant === "desktop" && "border-border/60",
        className
      )}
    >
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Navigation</span>
        <div className="h-px bg-gradient-to-r from-primary/60 via-primary/10 to-transparent" />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg border border-transparent px-4 py-3 font-medium transition",
                "hover:border-primary/70 hover:bg-primary/10 hover:text-primary",
                active && "border-primary/80 bg-primary/15 text-primary"
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f1323]/80 text-lg shadow-inner">
                {item.emoji}
              </span>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Synaptic Weather</p>
        <p className="mt-2 text-[11px] leading-relaxed">
          Neural activity stable. Emotional variance within optimal range. Continue optimization.
        </p>
      </div>
    </aside>
  );
};
