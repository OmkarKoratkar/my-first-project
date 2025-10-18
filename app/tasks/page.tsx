"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addTask, completeTask, deleteTask, getTasks } from "@/lib/api";
import { CheckCircle2, Plus, Trash2, TimerReset } from "lucide-react";

interface Task {
  id: string | number;
  title: string;
  status: "open" | "done";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pending = useMemo(() => tasks.filter((task) => task.status !== "done"), [tasks]);
  const completed = useMemo(() => tasks.filter((task) => task.status === "done"), [tasks]);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      const list = Array.isArray(data) ? data : data.tasks;
      setTasks(list ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to synchronize task queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      await addTask(newTask.trim());
      setNewTask("");
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to register task.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string | number) => {
    setLoading(true);
    try {
      await completeTask(id);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to mark complete.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to discard task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card
        title={
          <div className="flex items-center gap-3 text-xl font-semibold">
            <TimerReset className="h-6 w-6 text-primary" />
            Mission Control
          </div>
        }
        description="Deploy and track directives for your assistant."
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="task">New task vector</Label>
            <Input
              id="task"
              placeholder="e.g., Draft empathy report for tomorrow"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleAdd} disabled={loading || !newTask.trim()}>
              <Plus className="h-4 w-4" /> Queue Task
            </Button>
          </div>
        </div>
        {error && <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Active Objectives"
          description="Pending instructions awaiting execution."
          footer={<p className="text-xs text-muted-foreground">{pending.length} objectives in queue</p>}
        >
          <div className="space-y-3">
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">All directives are satisfied.</p>
            ) : (
              pending.map((task) => {
                const taskId = task.id != null ? String(task.id) : "";
                return (
                  <div
                    key={taskId || task.title}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-[#0f1323]/70 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">ID {taskId ? taskId.slice(0, 6) : "------"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => task.id != null && handleComplete(task.id)} disabled={loading || task.id == null}>
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/40 text-red-200 hover:border-red-400 hover:text-red-100"
                        onClick={() => task.id != null && handleDelete(task.id)}
                        disabled={loading || task.id == null}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
        <Card
          title="Completed"
          description="Recently fulfilled directives."
          footer={<p className="text-xs text-muted-foreground">{completed.length} missions complete</p>}
        >
          <div className="space-y-3">
            {completed.length === 0 ? (
              <p className="text-sm text-muted-foreground">Awaiting successful completions.</p>
            ) : (
              completed.map((task) => {
                const taskId = task.id != null ? String(task.id) : "";
                return (
                  <div
                    key={taskId || task.title}
                    className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary">{task.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-primary/70">ID {taskId ? taskId.slice(0, 6) : "------"}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
