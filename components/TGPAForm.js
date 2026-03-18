"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { letterToPoint } from "../utils/gradeConverter";
import { calculateTGPA } from "../utils/tgpaCalculator";

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "F"];

function createSubject() {
  return {
    id: Date.now() + Math.random(),
    name: "",
    credits: "",
    inputMode: "letter",
    gradeLetter: "O",
    gradePoint: 10,
  };
}

export default function TGPAForm() {
  const [subjects, setSubjects] = useState([createSubject()]);

  useEffect(() => {
    const raw = localStorage.getItem("apa_tgpa_subjects");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setSubjects(parsed);
      } catch {
        localStorage.removeItem("apa_tgpa_subjects");
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("apa_tgpa_subjects", JSON.stringify(subjects));
    }, 200);
    return () => clearTimeout(timeout);
  }, [subjects]);

  const { tgpa, totalCredits } = useMemo(() => {
    const rows = subjects.map((s) => ({
      credits: s.credits,
      gradePoint: s.inputMode === "letter" ? letterToPoint(s.gradeLetter) : s.gradePoint,
    }));
    return calculateTGPA(rows);
  }, [subjects]);

  const updateSubject = (id, key, value) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== id) return subject;
        const updated = { ...subject, [key]: value };
        if (key === "gradeLetter") updated.gradePoint = letterToPoint(value);
        if (key === "inputMode" && value === "letter") {
          updated.gradePoint = letterToPoint(updated.gradeLetter);
        }
        return updated;
      })
    );
  };

  return (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">TGPA Calculator</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="px-2 py-3">Subject Name</th>
              <th className="px-2 py-3">Credits</th>
              <th className="px-2 py-3">Input Type</th>
              <th className="px-2 py-3">Grade Letter / Point</th>
              <th className="px-2 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr
                key={subject.id}
                className="border-b border-slate-100 transition hover:bg-brand-50/60 dark:border-slate-800 dark:hover:bg-slate-800/70"
              >
                <td className="px-2 py-2">
                  <input
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                    placeholder="e.g. Mathematics"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    min="0"
                    value={subject.credits}
                    onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
                    className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    value={subject.inputMode}
                    onChange={(e) => updateSubject(subject.id, "inputMode", e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="letter">Grade Letter</option>
                    <option value="point">Grade Point</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  {subject.inputMode === "letter" ? (
                    <select
                      value={subject.gradeLetter}
                      onChange={(e) => updateSubject(subject.id, "gradeLetter", e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                    >
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade} ({letterToPoint(grade)})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={subject.gradePoint}
                      onChange={(e) => updateSubject(subject.id, "gradePoint", e.target.value)}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                    />
                  )}
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() =>
                      setSubjects((prev) => prev.filter((item) => item.id !== subject.id))
                    }
                    disabled={subjects.length === 1}
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
          onClick={() => setSubjects((prev) => [...prev, createSubject()])}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={16} /> Add Subject
        </button>

        <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm dark:border-brand-900 dark:bg-brand-900/30">
          <p className="font-semibold">Total Credits: {totalCredits.toFixed(2)}</p>
          <p className="text-lg font-bold text-brand-700 dark:text-brand-300">TGPA: {tgpa.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
