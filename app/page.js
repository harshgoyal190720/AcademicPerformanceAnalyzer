"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, GraduationCap, Sparkles } from "lucide-react";

export default function HomePage() {
  const [flashFeatures, setFlashFeatures] = useState(false);

  useEffect(() => {
    if (!flashFeatures) return;
    const timer = setTimeout(() => setFlashFeatures(false), 900);
    return () => clearTimeout(timer);
  }, [flashFeatures]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 text-slate-900 dark:text-slate-100">
      <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm dark:border-brand-800 dark:bg-slate-900/70 dark:text-brand-300">
          <Sparkles size={16} />
          Smart University Performance Toolkit
        </div>
        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight sm:text-6xl">
          Academic Performance Analyzer
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
          Track TGPA and CGPA, predict grades from marks, analyze trends, and export your complete academic report.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <GraduationCap size={18} />
            Open Dashboard
          </Link>
          <a
            href="#features"
            onClick={() => setFlashFeatures(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <BarChart3 size={18} />
            Explore Features
          </a>
        </div>
      </section>

      <section
        id="features"
        className={`mx-auto mb-16 max-w-6xl scroll-mt-6 px-6 transition ${
          flashFeatures ? "scale-[1.01]" : "scale-100"
        }`}
      >
        <h2 className="mb-5 text-center font-heading text-2xl font-bold sm:text-3xl">
          Explore Features
        </h2>
        <div
          className={`grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 ${
            flashFeatures ? "rounded-2xl ring-4 ring-brand-300/50" : ""
          }`}
        >
          {[
            { label: "Minimum Marks Needed Calculator", href: "/dashboard/target" },
            { label: "CGPA Tracker", href: "/dashboard/cgpa" },
            { label: "Predict grades and next-semester performance", href: "/dashboard#predict" },
            { label: "Export visual report as PDF", href: "/dashboard#report" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-white/50 bg-white/70 p-5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-brand-300 hover:bg-brand-50/70 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-brand-700 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
