"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getConfig, updateConfig } from "@/lib/api";
import { Settings2 } from "lucide-react";

interface ConfigState {
  speak_mode: boolean;
  voice: string;
  rate: number;
}

const VOICES = ["Daniel", "Veena", "Aria", "Nova", "Orion", "Synthwave"];

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigState>({ speak_mode: false, voice: "Daniel", rate: 140 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to sync configuration.");
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
      await updateConfig(config);
      setMessage("Configuration updated.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to update configuration matrix.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-3 text-xl font-semibold">
            <Settings2 className="h-6 w-6 text-primary" />
            Systems Configuration
          </div>
        }
        description="Control the assistant's voice, speaking cadence, and vocalization mode."
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button onClick={handleSave} disabled={saving}>
              Apply Changes
            </Button>
            <p className="text-xs text-muted-foreground">{saving ? "Streaming to synth engine..." : "Ensure FastAPI cortex is online."}</p>
          </div>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-border/50 bg-[#0f1323]/60 p-5">
            <div className="flex items-center justify-between">
              <Label>Speak Mode</Label>
              <Switch
                checked={config.speak_mode}
                onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, speak_mode: checked }))}
                disabled={loading || saving}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Toggle whether the assistant vocalizes responses in real time.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Voice Profile</Label>
            <Select
              value={config.voice}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, voice: value }))}
              disabled={loading || saving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {VOICES.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Speaking Rate ({config.rate} wpm)</Label>
            <Slider
              value={[config.rate]}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, rate: value[0] ?? prev.rate }))}
              min={100}
              max={200}
              step={5}
              disabled={loading || saving}
            />
            <p className="text-sm text-muted-foreground">
              Adjust the pacing to align with your preferred conversational tempo.
            </p>
          </div>
        </div>
        {message && (
          <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</p>
        )}
      </Card>
    </div>
  );
}
