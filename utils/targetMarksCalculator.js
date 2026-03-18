import { requiredPointToMinMarks } from "./gradeConverter";

export function calculateTargetMarks({
  currentTGPA = 0,
  targetTGPA = 0,
  completedCredits = 0,
  remainingSubjects = [],
}) {
  const rem = remainingSubjects.filter((s) => Number(s.credits) > 0);
  const remainingCredits = rem.reduce((sum, s) => sum + Number(s.credits), 0);

  if (!remainingCredits) {
    return {
      feasible: false,
      reason: "Please add at least one remaining subject with credits.",
      requiredPoint: 0,
      perSubject: [],
    };
  }

  const neededPoints =
    Number(targetTGPA) * (Number(completedCredits) + remainingCredits) -
    Number(currentTGPA) * Number(completedCredits);
  const requiredPoint = neededPoints / remainingCredits;

  if (requiredPoint > 10) {
    return {
      feasible: false,
      reason:
        "Target is not achievable with remaining credits. Required grade point exceeds 10.",
      requiredPoint,
      perSubject: [],
    };
  }

  const minMarks = requiredPointToMinMarks(requiredPoint);
  const perSubject = rem.map((subject) => ({
    name: subject.name || "Subject",
    credits: Number(subject.credits),
    minMarks,
    requiredPoint,
  }));

  return {
    feasible: true,
    reason: "",
    requiredPoint,
    perSubject,
  };
}
