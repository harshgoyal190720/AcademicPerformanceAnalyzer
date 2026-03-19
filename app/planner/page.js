"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import AuthNav from "../../components/AuthNav";
import { migrateLegacyKey, scopedKey } from "../../utils/storageKeys";

function createTask() {
  return { id: Date.now() + Math.random(), title: "", done: false };
}

export default function PlannerPage() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const plannerStorageKey = scopedKey("apa_planner_tasks", email);
  const [tasks, setTasks] = useState([createTask()]);

  useEffect(() => {
    migrateLegacyKey("apa_planner_tasks", email);
    const raw = localStorage.getItem(plannerStorageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) setTasks(parsed);
    } catch {
      localStorage.removeItem(plannerStorageKey);
    }
  }, [email, plannerStorageKey]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(plannerStorageKey, JSON.stringify(tasks));
    }, 200);
    return () => clearTimeout(timeout);
  }, [tasks, plannerStorageKey]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-5">
        <header className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-bold">Study Planner</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Keep your study goals organized per account.
              </p>
            </div>
            <AuthNav />
          </div>
          <div className="mt-3">
            <Link href="/dashboard" className="font-semibold text-brand-700 underline dark:text-brand-300">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="card">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) => (t.id === task.id ? { ...t, done: e.target.checked } : t))
                    )
                  }
                />
                <input
                  value={task.title}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) => (t.id === task.id ? { ...t, title: e.target.value } : t))
                    )
                  }
                  placeholder="Enter task"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                />
                <button
                  onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTasks((prev) => [...prev, createTask()])}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>
    </main>
  );
}
