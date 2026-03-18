"use client";

import { useMemo, useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { calculateTargetMarks } from "../utils/targetMarksCalculator";

function createRemainingSubject() {
  return { id: Date.now() + Math.random(), name: "", credits: "" };
}

export default function TargetCalculator() {
  const [currentTGPA, setCurrentTGPA] = useState("");
  const [targetTGPA, setTargetTGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  const [remainingSubjects, setRemainingSubjects] = useState([createRemainingSubject()]);

  const result = useMemo(
    () =>
      calculateTargetMarks({
        currentTGPA,
        targetTGPA,
        completedCredits,
        remainingSubjects,
      }),
    [currentTGPA, targetTGPA, completedCredits, remainingSubjects]
  );

  const updateSubject = (id, key, value) => {
    setRemainingSubjects((prev) =>
      prev.map((subject) => (subject.id === id ? { ...subject, [key]: value } : subject))
    );
  };

  return (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">Minimum Marks Needed Calculator</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Current TGPA</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={currentTGPA}
            onChange={(e) => setCurrentTGPA(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Target TGPA</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={targetTGPA}
            onChange={(e) => setTargetTGPA(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold">Completed Credits</span>
          <input
            type="number"
            min="0"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="px-2 py-2">Remaining Subject</th>
              <th className="px-2 py-2">Credits</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {remainingSubjects.map((subject) => (
              <tr key={subject.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-2 py-2">
                  <input
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
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
                  <button
                    onClick={() =>
                      setRemainingSubjects((prev) => prev.filter((row) => row.id !== subject.id))
                    }
                    disabled={remainingSubjects.length === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-2 text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setRemainingSubjects((prev) => [...prev, createRemainingSubject()])}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/40"
      >
        <Plus size={15} /> Add Remaining Subject
      </button>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        {!result.feasible ? (
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{result.reason}</p>
        ) : (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300">
              <Target size={15} /> Required average grade point in remaining subjects:{" "}
              {result.requiredPoint.toFixed(2)}
            </p>
            {result.perSubject.map((item) => (
              <p key={item.name + item.credits} className="text-sm text-slate-700 dark:text-slate-300">
                You need at least <span className="font-bold">{item.minMarks}</span> marks in{" "}
                <span className="font-bold">{item.name || "this subject"}</span> to reach your target.
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
