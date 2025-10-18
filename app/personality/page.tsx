"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPersonality, updatePersonality } from "@/lib/api";
import { Theater } from "lucide-react";

interface Personality {
  tone: string;
  humor: string;
  focus: string;
}

const TONES = ["Calm", "Enthusiastic", "Empathetic", "Analytical", "Bold"];
const DEFAULT_PERSONALITY: Personality = { tone: "Calm", humor: "Playful", focus: "Balanced" };
const HUMORS = ["Dry", "Playful", "Witty", "Serious", "Sarcastic"];
const FOCUS = ["Creative", "Strategic", "Supportive", "Technical", "Balanced"];

export default function PersonalityPage() {
  const [state, setState] = useState<Personality>(DEFAULT_PERSONALITY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPersonality();
        setState({
          tone: data?.tone ?? DEFAULT_PERSONALITY.tone,
          humor: data?.humor ?? DEFAULT_PERSONALITY.humor,
          focus: data?.focus ?? DEFAULT_PERSONALITY.focus
        });
      } catch (error) {
        console.error(error);
        setMessage("Failed to retrieve personality signature.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updatePersonality(state);
      setMessage("Signature updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to write to personality core.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Personality, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-3 text-xl font-semibold">
            <Theater className="h-6 w-6 text-primary" />
            Personality Core
          </div>
        }
        description="Modulate tone, humor, and focus to sculpt the assistant's presence."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button onClick={handleSave} disabled={saving}>
              Save Signature
            </Button>
            <p className="text-xs text-muted-foreground">{saving ? "Updating resonance..." : "Adjust sliders then commit changes."}</p>
          </div>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={state.tone} onValueChange={(value) => handleChange("tone", value)} disabled={loading || saving}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Humor</Label>
            <Select value={state.humor} onValueChange={(value) => handleChange("humor", value)} disabled={loading || saving}>
              <SelectTrigger>
                <SelectValue placeholder="Select humor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {HUMORS.map((humor) => (
                    <SelectItem key={humor} value={humor}>
                      {humor}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Focus</Label>
            <Select value={state.focus} onValueChange={(value) => handleChange("focus", value)} disabled={loading || saving}>
              <SelectTrigger>
                <SelectValue placeholder="Select focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {FOCUS.map((focus) => (
                    <SelectItem key={focus} value={focus}>
                      {focus}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {message && (
          <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>
        )}
      </Card>
    </div>
  );
}
