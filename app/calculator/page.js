"use client";

import Link from "next/link";
import AuthNav from "../../components/AuthNav";
import TGPAForm from "../../components/TGPAForm";
import MarksPredictor from "../../components/MarksPredictor";
import TargetCalculator from "../../components/TargetCalculator";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-bold">Calculator</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                TGPA/CGPA and grade prediction tools in one place.
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
        <TGPAForm />
        <MarksPredictor />
        <TargetCalculator />
      </div>
    </main>
  );
}
