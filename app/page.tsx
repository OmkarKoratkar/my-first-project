"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, ListChecks } from "lucide-react";
import { getConfig, getFacts, getPersonality, getTasks } from "@/lib/api";

interface Fact {
  id: string | number;
  content: string;
}

interface Task {
  id: string | number;
  title: string;
  status: "open" | "done";
}

interface Personality {
  tone: string;
  humor: string;
  focus: string;
}

interface Config {
  speak_mode: boolean;
  voice: string;
  rate: number;
}

type FactsResponse = Awaited<ReturnType<typeof getFacts>>;
type TasksResponse = Awaited<ReturnType<typeof getTasks>>;

function parseFacts(data: FactsResponse): Fact[] {
  if (!data) return [];
  return (Array.isArray(data) ? data : data.facts ?? []) as Fact[];
}

function parseTasks(data: TasksResponse): Task[] {
  if (!data) return [];
  return (Array.isArray(data) ? data : data.tasks ?? []) as Task[];
}

export default function DashboardPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [factsRes, tasksRes, personalityRes, configRes] = await Promise.all([
          getFacts(),
          getTasks(),
          getPersonality(),
          getConfig()
        ]);
        setFacts(parseFacts(factsRes));
        setTasks(parseTasks(tasksRes));
        setPersonality(personalityRes);
        setConfig(configRes);
      } catch (error) {
        console.error("Failed to load dashboard summary", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card
        title={
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <Sparkles className="h-6 w-6 text-primary" />
            Neural Prelude
          </div>
        }
        description="A synthesized overview of your assistant's cognition."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Systems nominal</p>
            <Button asChild>
              <a href="/memory">Enter Command Center</a>
            </Button>
          </div>
        }
      >
        <p className="text-base leading-relaxed text-muted-foreground">
          Welcome to V.E.D., your virtual emotional dashboard. Monitor and sculpt memories, tasks, personality, and vocal systems in real
          time. All modules are synchronized with the FastAPI cortex running locally.
        </p>
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-[#0f1323]/60 p-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Memory Clusters
            </div>
            <p className="mt-2 text-3xl font-bold text-primary">
              {loading ? "--" : facts.length}
            </p>
            <p className="text-xs text-muted-foreground">Facts encoded</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-[#0f1323]/60 p-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <ListChecks className="h-5 w-5 text-primary" />
              Task Vectors
            </div>
            <p className="mt-2 text-3xl font-bold text-primary">
              {loading ? "--" : tasks.filter((task) => task.status !== "done").length}
            </p>
            <p className="text-xs text-muted-foreground">Active objectives</p>
          </div>
        </div>
      </Card>
      <div className="space-y-6">
        <Card title="Personality Signature" description="Realtime resonance across tone, humor, and focus parameters.">
          {loading ? (
            <p className="text-muted-foreground">Synthesizing...</p>
          ) : (
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Tone</span>
                <span className="text-base font-semibold text-primary">{personality?.tone ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Humor</span>
                <span className="text-base font-semibold text-primary">{personality?.humor ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Focus</span>
                <span className="text-base font-semibold text-primary">{personality?.focus ?? "-"}</span>
              </div>
            </div>
          )}
        </Card>
        <Card title="Vocal Config" description="Speak mode and voice channel metrics.">
          {loading ? (
            <p className="text-muted-foreground">Calibrating outputs...</p>
          ) : (
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Speak Mode</span>
                <span className="text-base font-semibold text-primary">{config?.speak_mode ? "Enabled" : "Muted"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Voice</span>
                <span className="text-base font-semibold text-primary">{config?.voice ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-[#101427]/70 px-4 py-3">
                <span className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Rate</span>
                <span className="text-base font-semibold text-primary">{config?.rate ?? "-"} wpm</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
