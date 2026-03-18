"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Moon, Sun } from "lucide-react";
import TGPAForm from "../../components/TGPAForm";
import MarksPredictor from "../../components/MarksPredictor";
import PredictionPanel from "../../components/PredictionPanel";
import { calculateCGPA, calculateTGPA } from "../../utils/tgpaCalculator";

const AnalyticsCharts = dynamic(() => import("../../components/AnalyticsCharts"), {
  ssr: false,
  loading: () => (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">Analytics Dashboard</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Loading charts...</p>
    </div>
  ),
});

const ExportPDF = dynamic(() => import("../../components/ExportPDF"), {
  ssr: false,
});

export default function DashboardPage() {
  const [semesters, setSemesters] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  const reportRef = useRef(null);

  useEffect(() => {
    const savedSemesters = localStorage.getItem("apa_semesters");
    if (savedSemesters) {
      try {
        const parsed = JSON.parse(savedSemesters);
        if (Array.isArray(parsed)) setSemesters(parsed);
      } catch {
        localStorage.removeItem("apa_semesters");
      }
    }

    const savedTheme = localStorage.getItem("apa_theme");
    if (savedTheme === "dark") setDarkMode(true);
    setGeneratedAt(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("apa_semesters", JSON.stringify(semesters));
    }, 250);
    return () => clearTimeout(timeout);
  }, [semesters]);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("apa_theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("apa_theme", "light");
    }
  }, [darkMode]);

  const semestersWithStats = useMemo(
    () =>
      semesters.map((semester) => {
        const subjects = (semester.subjects || []).map((subject) => ({
          ...subject,
          gradePoint: Number(subject.gradePoint || 0),
        }));
        return {
          ...semester,
          subjects,
          tgpa: calculateTGPA(subjects).tgpa,
        };
      }),
    [semesters]
  );

  const cgpaData = useMemo(() => calculateCGPA(semestersWithStats), [semestersWithStats]);
  const tgpaValues = semestersWithStats.map((s) => s.tgpa);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 px-4 py-6 text-slate-900 transition dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl" ref={reportRef}>
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
                Academic Report Dashboard
              </p>
              <h1 className="mt-1 font-heading text-3xl font-bold">Academic Performance Analyzer</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Generated on {generatedAt || new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <ExportPDF reportRef={reportRef} />
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-900/30">
              <p className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">Semesters</p>
              <p className="text-2xl font-bold">{semestersWithStats.length}</p>
            </div>
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-900/30">
              <p className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">Total Credits</p>
              <p className="text-2xl font-bold">{cgpaData.totalCredits.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-900/30">
              <p className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">Overall CGPA</p>
              <p className="text-2xl font-bold">{cgpaData.cgpa.toFixed(2)}</p>
            </div>
          </div>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/target"
            className="card flex items-center justify-between border-brand-200 bg-brand-50/70 dark:border-brand-900 dark:bg-brand-900/25"
          >
            <div>
              <p className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">
                Dedicated Page
              </p>
              <h2 className="mt-1 font-heading text-lg font-bold">Minimum Marks Needed Calculator</h2>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/dashboard/cgpa"
            className="card flex items-center justify-between border-brand-200 bg-brand-50/70 dark:border-brand-900 dark:bg-brand-900/25"
          >
            <div>
              <p className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">
                Dedicated Page
              </p>
              <h2 className="mt-1 font-heading text-lg font-bold">CGPA Tracker</h2>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>

        <div className="space-y-5">
          <section id="tgpa-cgpa" className="scroll-mt-6">
            <TGPAForm />
          </section>
          <section id="predict" className="scroll-mt-6">
            <MarksPredictor />
          </section>
          <section id="next-semester" className="scroll-mt-6">
            <PredictionPanel tgpaValues={tgpaValues} />
          </section>
          <section id="report" className="scroll-mt-6">
            <AnalyticsCharts semesters={semestersWithStats} />
          </section>
        </div>

        <footer className="mt-8 pb-4 text-center text-sm text-slate-600 dark:text-slate-300">
          <p>Student performance summary, semester TGPA list, CGPA, subject tables, and analytics included.</p>
          <Link href="/" className="mt-2 inline-block font-semibold text-brand-700 underline dark:text-brand-300">
            Back to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}
