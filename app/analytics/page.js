"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthNav from "../../components/AuthNav";
import PredictionPanel from "../../components/PredictionPanel";
import AnalyticsCharts from "../../components/AnalyticsCharts";
import { calculateTGPA } from "../../utils/tgpaCalculator";
import { migrateLegacyKey, scopedKey } from "../../utils/storageKeys";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const semestersStorageKey = scopedKey("apa_semesters", email);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    migrateLegacyKey("apa_semesters", email);
    const raw = localStorage.getItem(semestersStorageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setSemesters(parsed);
    } catch {
      localStorage.removeItem(semestersStorageKey);
    }
  }, [email, semestersStorageKey]);

  const semestersWithStats = useMemo(
    () =>
      semesters.map((semester) => {
        const subjects = (semester.subjects || []).map((s) => ({
          ...s,
          gradePoint: Number(s.gradePoint || 0),
        }));
        return {
          ...semester,
          subjects,
          tgpa: calculateTGPA(subjects).tgpa,
        };
      }),
    [semesters]
  );
  const tgpaValues = semestersWithStats.map((s) => s.tgpa);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-bold">Analytics</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                View trend charts and next-semester prediction from your stored semesters.
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
        <PredictionPanel tgpaValues={tgpaValues} />
        <AnalyticsCharts semesters={semestersWithStats} />
      </div>
    </main>
  );
}
