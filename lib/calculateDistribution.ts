// utils/calculateDistribution.ts
import { getGrade, GRADE_SCALE } from './grading';

export function calculateGradeDistribution(results: any[]) {
  // 1. Initialize counts (A: 0, B: 0, ...)
  const distribution: { [key: string]: number } = {};
  GRADE_SCALE.forEach(g => distribution[g.grade] = 0);

  let totalGradesCount = 0;

  // 2. Loop through every student and every subject
  results.forEach((student) => {
    student.scores.forEach((scoreItem: any) => {
      const grade = getGrade(scoreItem.total);
      if (distribution[grade] !== undefined) {
        distribution[grade]++;
        totalGradesCount++;
      }
    });
  });

  // 3. Format for the Table (add percentages)
  return GRADE_SCALE.map((g) => ({
    grade: g.grade,
    range: `${g.min}-${g.max}`,
    count: distribution[g.grade],
    percentage: ((distribution[g.grade] / totalGradesCount) * 100).toFixed(1) + "%",
    color: g.color
  }));
}