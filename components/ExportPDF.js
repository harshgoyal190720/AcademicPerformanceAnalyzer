"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function ExportPDF({ reportRef }) {
  const [loading, setLoading] = useState(false);

  const exportPdf = async () => {
    if (!reportRef?.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`academic-report-${new Date().toISOString().slice(0, 10)}.pdf`);
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
