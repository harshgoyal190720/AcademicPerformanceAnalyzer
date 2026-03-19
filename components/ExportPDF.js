"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function ExportPDF({ reportRef }) {
  const [loading, setLoading] = useState(false);

  const exportPdf = async () => {
    if (!reportRef?.current) return;
    setLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = reportRef.current;
      const filename = `academic-report-${new Date().toISOString().slice(0, 10)}.pdf`;

      await html2pdf()
        .from(element)
        .set({
          filename,
          margin: [8, 8, 8, 8],
          image: { type: "png", quality: 1 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .save();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportPdf}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Download size={16} />
      {loading ? "Generating PDF..." : "Download PDF Academic Report"}
    </button>
  );
}
