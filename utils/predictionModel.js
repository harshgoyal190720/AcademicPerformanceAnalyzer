export function predictNextTGPA(tgpaValues = []) {
  const list = tgpaValues.map(Number).filter((v) => !Number.isNaN(v));
  if (!list.length) return { predicted: 0, message: "Add semesters to predict next TGPA." };
  if (list.length === 1) {
    return {
      predicted: list[0],
      message: `If current trend continues, your next TGPA may be ${list[0].toFixed(2)}.`,
    };
  }

  const deltas = [];
  for (let i = 1; i < list.length; i += 1) deltas.push(list[i] - list[i - 1]);
  const avgDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
  const predicted = Math.max(0, Math.min(10, list[list.length - 1] + avgDelta));
  const direction =
    avgDelta > 0.05 ? "improving" : avgDelta < -0.05 ? "declining" : "stable";

  return {
    predicted,
    message: `If current trend continues, your next TGPA may be ${predicted.toFixed(
      2
    )}. Your performance trend is currently ${direction}.`,
  };
}
