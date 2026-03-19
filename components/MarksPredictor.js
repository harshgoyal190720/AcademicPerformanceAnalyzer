"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { enrichMarksRows, calculatePredictedTGPA } from "../utils/marksPredictor";
import { migrateLegacyKey, scopedKey } from "../utils/storageKeys";

function createRow() {
  return { id: Date.now() + Math.random(), name: "", credits: "", marks: "" };
}

export default function MarksPredictor() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const storageKey = scopedKey("apa_marks_rows", email);
  const [rows, setRows] = useState([createRow()]);

  useEffect(() => {
    migrateLegacyKey("apa_marks_rows", email);
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setRows(parsed);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [email, storageKey]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    }, 200);
    return () => clearTimeout(timeout);
  }, [rows, storageKey]);

  const enrichedRows = useMemo(() => enrichMarksRows(rows), [rows]);
  const { tgpa } = useMemo(() => calculatePredictedTGPA(rows), [rows]);

  const update = (id, key, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  return (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">Marks to Grade Predictor</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="px-2 py-3">Subject Name</th>
              <th className="px-2 py-3">Credits</th>
              <th className="px-2 py-3">Expected Marks</th>
              <th className="px-2 py-3">Grade Letter</th>
              <th className="px-2 py-3">Grade Point</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrichedRows.map((row) => (
              <tr
                key={row.id}
                className={`border-b transition hover:bg-brand-50/60 dark:hover:bg-slate-800/70 ${
                  row.isFailing ? "border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20" : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <td className="px-2 py-2">
                  <input
                    value={row.name}
                    onChange={(e) => update(row.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.credits}
                    onChange={(e) => update(row.id, "credits", e.target.value)}
                    className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={row.marks}
                    onChange={(e) => update(row.id, "marks", e.target.value)}
                    className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-2 py-2 font-semibold">{row.gradeLetter}</td>
                <td className="px-2 py-2">{row.gradePoint}</td>
                <td className="px-2 py-2">
                  {row.isFailing ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/70 dark:text-rose-200">
                      <AlertTriangle size={14} />
                      Risk of failing this subject
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Safe
                    </span>
                  )}
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}
                    disabled={rows.length === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-2 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setRows((prev) => [...prev, createRow()])}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={16} /> Add Subject
        </button>
        <div className="animate-pulseCard rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm dark:border-brand-900 dark:bg-brand-900/30">
          <p className="text-base font-bold text-brand-700 dark:text-brand-300">
            Expected TGPA: {tgpa.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
