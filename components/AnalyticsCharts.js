"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#1c69f1", "#2b86ff", "#52a8ff", "#8bc8ff", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsCharts({ semesters = [] }) {
  const lineData = semesters.map((semester, index) => ({
    semester: semester.name || `Sem ${index + 1}`,
    tgpa: Number(Number(semester.tgpa || 0).toFixed(2)),
  }));

  const latestSemester = semesters[semesters.length - 1];
  const barData = (latestSemester?.subjects || []).map((subject) => ({
    subject: subject.name || "Subject",
    gradePoint: Number(subject.gradePoint || 0),
  }));

  const distribution = {};
  semesters.forEach((semester) => {
    (semester.subjects || []).forEach((subject) => {
      const grade = subject.gradeLetter || "F";
      distribution[grade] = (distribution[grade] || 0) + 1;
    });
  });
  const pieData = Object.entries(distribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">Analytics Dashboard</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="mb-3 text-sm font-semibold">TGPA Trend Across Semesters</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tgpa"
                  stroke="#1c69f1"
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="mb-3 text-sm font-semibold">Latest Semester Subject Grade Points</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="gradePoint"
                  fill="#2b86ff"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Grade Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                  isAnimationActive={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
