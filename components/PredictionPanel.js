"use client";

import { BrainCircuit } from "lucide-react";
import { predictNextTGPA } from "../utils/predictionModel";

export default function PredictionPanel({ tgpaValues = [] }) {
  const { predicted, message } = predictNextTGPA(tgpaValues);

  return (
    <div className="card">
      <h2 className="font-heading text-xl font-bold">AI Next-Semester Prediction</h2>
      <div className="mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-blue-700 p-5 text-white shadow-soft">
        <p className="inline-flex items-center gap-2 text-sm font-semibold">
          <BrainCircuit size={16} /> Predicted TGPA
        </p>
        <p className="mt-1 text-3xl font-bold">{predicted.toFixed(2)}</p>
        <p className="mt-2 text-sm text-blue-100">{message}</p>
      </div>
    </div>
  );
}
