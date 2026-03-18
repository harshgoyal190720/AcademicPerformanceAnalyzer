"use client";

import { Plus, Trash2 } from "lucide-react";
import { letterToPoint } from "../utils/gradeConverter";
import { calculateCGPA, calculateTGPA } from "../utils/tgpaCalculator";

const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "F"];

function createSubject() {
  return { id: Date.now() + Math.random(), name: "", credits: "", gradeLetter: "O", gradePoint: 10 };
}

export default function SemesterTracker({ semesters, setSemesters }) {
  const addSemester = () => {
    setSemesters((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: `Semester ${prev.length + 1}`,
        subjects: [createSubject()],
      },
    ]);
  };

  const updateSemesterName = (semesterId, value) => {
    setSemesters((prev) => prev.map((s) => (s.id === semesterId ? { ...s, name: value } : s)));
  };

  const deleteSemester = (semesterId) => {
    setSemesters((prev) => prev.filter((s) => s.id !== semesterId));
  };

  const addSubject = (semesterId) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semesterId ? { ...s, subjects: [...s.subjects, createSubject()] } : s
      )
    );
  };

  const deleteSubject = (semesterId, subjectId) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== semesterId) return s;
        const filtered = s.subjects.filter((sub) => sub.id !== subjectId);
        return { ...s, subjects: filtered.length ? filtered : [createSubject()] };
      })
    );
  };

  const updateSubject = (semesterId, subjectId, key, value) => {
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== semesterId) return s;
        return {
          ...s,
          subjects: s.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            const updated = { ...sub, [key]: value };
            if (key === "gradeLetter") updated.gradePoint = letterToPoint(value);
            return updated;
          }),
        };
      })
    );
  };

  const cgpaData = calculateCGPA(semesters);

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-bold">CGPA Tracker</h2>
        <button
          onClick={addSemester}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus size={16} /> Add New Semester
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm dark:border-brand-900 dark:bg-brand-900/30">
        <p className="font-semibold">Total Credits: {cgpaData.totalCredits.toFixed(2)}</p>
        <p className="text-lg font-bold text-brand-700 dark:text-brand-300">Overall CGPA: {cgpaData.cgpa.toFixed(2)}</p>
      </div>

      <div className="mt-4 space-y-4">
        {semesters.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            No semesters added yet.
          </p>
        ) : (
          semesters.map((semester) => {
            const semTGPA = calculateTGPA(semester.subjects).tgpa;
            return (
              <div key={semester.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <input
                    value={semester.name}
                    onChange={(e) => updateSemesterName(semester.id, e.target.value)}
                    className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                  />
                  <div className="flex items-center gap-2">
                    <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      Semester TGPA: {semTGPA.toFixed(2)}
                    </p>
                    <button
                      onClick={() => deleteSemester(semester.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-2 text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                        <th className="px-2 py-2">Subject</th>
                        <th className="px-2 py-2">Credits</th>
                        <th className="px-2 py-2">Grade Letter</th>
                        <th className="px-2 py-2">Grade Point</th>
                        <th className="px-2 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.subjects.map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-b border-slate-100 transition hover:bg-brand-50/50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                        >
                          <td className="px-2 py-2">
                            <input
                              value={sub.name}
                              onChange={(e) =>
                                updateSubject(semester.id, sub.id, "name", e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              value={sub.credits}
                              onChange={(e) =>
                                updateSubject(semester.id, sub.id, "credits", e.target.value)
                              }
                              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={sub.gradeLetter}
                              onChange={(e) =>
                                updateSubject(semester.id, sub.id, "gradeLetter", e.target.value)
                              }
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none ring-brand-400 focus:ring dark:border-slate-700 dark:bg-slate-950"
                            >
                              {GRADE_OPTIONS.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2 font-semibold">{letterToPoint(sub.gradeLetter)}</td>
                          <td className="px-2 py-2">
                            <button
                              onClick={() => deleteSubject(semester.id, sub.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-2 text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
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
                  onClick={() => addSubject(semester.id)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-300 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/40"
                >
                  <Plus size={15} /> Add Subject
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
