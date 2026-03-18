import { marksToGrade } from "./gradeConverter";
import { calculateTGPA } from "./tgpaCalculator";

export function enrichMarksRows(rows = []) {
  return rows.map((row) => {
    const { letter, point } = marksToGrade(row.marks);
    return {
      ...row,
      gradeLetter: letter,
      gradePoint: point,
      isFailing: Number(row.marks) < 40,
    };
  });
}

export function calculatePredictedTGPA(rows = []) {
  const enriched = enrichMarksRows(rows);
  return calculateTGPA(
    enriched.map((row) => ({ credits: row.credits, gradePoint: row.gradePoint }))
  );
}
