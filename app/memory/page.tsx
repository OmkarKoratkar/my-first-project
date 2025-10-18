"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addFact, deleteFact, getFacts } from "@/lib/api";
import { Trash2, Plus, Brain } from "lucide-react";

interface Fact {
  id: string | number;
  content: string;
}

export default function MemoryPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [newFact, setNewFact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFacts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getFacts();
      const list = Array.isArray(data) ? data : data.facts;
      setFacts(list ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to sync memory cortex.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFacts();
  }, []);

  const handleAdd = async () => {
    if (!newFact.trim()) return;
    setLoading(true);
    try {
      await addFact(newFact.trim());
      setNewFact("");
      await loadFacts();
    } catch (err) {
      console.error(err);
      setError("Failed to encode fact.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    try {
      await deleteFact(id);
      await loadFacts();
    } catch (err) {
      console.error(err);
      setError("Failed to purge fact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-3 text-xl font-semibold">
            <Brain className="h-6 w-6 text-primary" />
            Memory Cortex
          </div>
        }
        description="Visualize and curate the assistant's persistent knowledge."
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="fact">Inject new fact</Label>
            <Input
              id="fact"
              placeholder="e.g., Favorite recharge drink is synth-coffee"
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleAdd} disabled={loading || !newFact.trim()}>
              <Plus className="h-4 w-4" /> Encode Fact
            </Button>
          </div>
        </div>
        {error && <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {facts.length === 0 && !loading ? (
          <Card className="md:col-span-2 xl:col-span-3" description="No memories recorded yet. Encode new knowledge to begin.">
            <p className="text-sm text-muted-foreground">Your assistant awaits the first injection of experience.</p>
          </Card>
        ) : (
          facts.map((fact) => {
            const factId = fact.id != null ? String(fact.id) : "";
            return (
              <Card
                key={factId || fact.content}
                title={
                  <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <span>Fact Node</span>
                    <span className="text-[11px] text-primary">{factId ? factId.slice(0, 6) : "------"}</span>
                  </div>
                }
                footer={
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/40 text-red-200 hover:border-red-400 hover:text-red-100"
                      onClick={() => fact.id != null && handleDelete(fact.id)}
                      disabled={loading || fact.id == null}
                    >
                      <Trash2 className="h-4 w-4" />
                      Purge
                    </Button>
                  </div>
                }
              >
                <p className="text-sm leading-relaxed text-foreground/90">{fact.content}</p>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
