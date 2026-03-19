export const GRADE_POINTS = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  F: 0,
};

export function letterToPoint(letter) {
  return GRADE_POINTS[letter] ?? 0;
}

export function pointToLetter(point) {
  const value = Number(point);
  if (Number.isNaN(value)) return "F";
  if (value >= 9.5) return "O";
  if (value >= 8.5) return "A+";
  if (value >= 7.5) return "A";
  if (value >= 6.5) return "B+";
  if (value >= 5.5) return "B";
  if (value >= 4.5) return "C";
  return "F";
}

export function marksToGrade(marks) {
  const value = Number(marks);
  if (Number.isNaN(value)) return { letter: "F", point: 0 };
  if (value >= 90) return { letter: "O", point: 10 };
  if (value >= 80) return { letter: "A+", point: 9 };
  if (value >= 70) return { letter: "A", point: 8 };
  if (value >= 60) return { letter: "B+", point: 7 };
  if (value >= 50) return { letter: "B", point: 6 };
  if (value >= 40) return { letter: "C", point: 5 };
  return { letter: "F", point: 0 };
}

export function requiredPointToMinMarks(requiredPoint) {
  const point = Number(requiredPoint);
  if (Number.isNaN(point) || point <= 0) return 0;
  if (point > 10) return null;
  if (point > 9) return 90;
  if (point > 8) return 80;
  if (point > 7) return 70;
  if (point > 6) return 60;
  if (point > 5) return 50;
  if (point > 0) return 40;
  return 0;
}
