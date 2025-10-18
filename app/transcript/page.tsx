"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTranscript } from "@/lib/api";
import { NotebookPen } from "lucide-react";

interface TranscriptEntry {
  id?: string;
  timestamp?: string;
  time?: string;
  speaker: string;
  message: string;
}

function formatTimestamp(entry: TranscriptEntry) {
  if (entry.timestamp) return new Date(entry.timestamp).toLocaleTimeString();
  if (entry.time) return entry.time;
  return new Date().toLocaleTimeString();
}

export default function TranscriptPage() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadTranscript = async (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getTranscript();
      setEntries(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to sync conversation log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTranscript(true);
    intervalRef.current = setInterval(() => {
      void loadTranscript();
    }, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-3 text-xl font-semibold">
            <NotebookPen className="h-6 w-6 text-primary" />
            Conversation Transcript
          </div>
        }
        description="Monitor the last 50 exchanges with your assistant."
      >
        {error && <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <ScrollArea className="h-[480px] w-full overflow-hidden rounded-xl border border-border/50 bg-[#080b18]/60">
          <div className="space-y-4 p-6">
            {loading && entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading transcript...</p>
            ) : entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No conversation available yet.</p>
            ) : (
              entries.map((entry, index) => (
                <div
                  key={entry.id ?? index}
                  className="group relative overflow-hidden rounded-xl border border-border/40 bg-[#0f1323]/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{entry.speaker}</span>
                    <span className="text-primary/80">{formatTimestamp(entry)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{entry.message}</p>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/5 opacity-0 transition group-hover:opacity-100" />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
