export function calculateTGPA(subjects = []) {
  const valid = subjects.filter((s) => Number(s.credits) > 0);
  const totalCredits = valid.reduce((sum, s) => sum + Number(s.credits), 0);
  const weightedPoints = valid.reduce(
    (sum, s) => sum + Number(s.credits) * Number(s.gradePoint || 0),
    0
  );

  if (!totalCredits) return { tgpa: 0, totalCredits: 0 };
  return { tgpa: weightedPoints / totalCredits, totalCredits };
}

export function calculateCGPA(semesters = []) {
  let totalCredits = 0;
  let weightedPoints = 0;

  semesters.forEach((semester) => {
    (semester.subjects || []).forEach((subject) => {
      const credits = Number(subject.credits || 0);
      const gradePoint = Number(subject.gradePoint || 0);
      if (credits > 0) {
        totalCredits += credits;
        weightedPoints += credits * gradePoint;
      }
    });
  });

  if (!totalCredits) return { cgpa: 0, totalCredits: 0 };
  return { cgpa: weightedPoints / totalCredits, totalCredits };
}
