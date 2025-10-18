"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, children, footer, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border/60 bg-[#0b0d19]/80 p-6 shadow-card backdrop-blur",
          "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent",
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="mb-4 space-y-1">
            {title && (
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-4 text-sm text-foreground/90">{children}</div>
        {footer && <div className="mt-4 border-t border-border/50 pt-4">{footer}</div>}
      </div>
    );
  }
);
Card.displayName = "Card";
