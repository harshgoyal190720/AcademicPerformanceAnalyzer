"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SemesterTracker from "../../../components/SemesterTracker";

export default function CGPATrackerPage() {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const savedSemesters = localStorage.getItem("apa_semesters");
    if (!savedSemesters) return;
    try {
      const parsed = JSON.parse(savedSemesters);
      if (Array.isArray(parsed)) setSemesters(parsed);
    } catch {
      localStorage.removeItem("apa_semesters");
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("apa_semesters", JSON.stringify(semesters));
    }, 250);
    return () => clearTimeout(timeout);
  }, [semesters]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h1 className="font-heading text-3xl font-bold">CGPA Tracker</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Manage semester subjects, compute TGPA by semester, and track your overall CGPA.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/dashboard/target"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
            >
              Open Target Calculator
            </Link>
          </div>
        </header>

        <SemesterTracker semesters={semesters} setSemesters={setSemesters} />
      </div>
    </main>
  );
}
