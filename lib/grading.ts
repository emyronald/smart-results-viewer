// utils/grading.ts

export const GRADE_SCALE = [
  { grade: "A", min: 75, max: 100, color: "text-green-600" },
  { grade: "B", min: 65, max: 74, color: "text-blue-600" },
  { grade: "C", min: 50, max: 64, color: "text-yellow-600" },
  { grade: "D", min: 45, max: 49, color: "text-orange-600" },
  { grade: "E", min: 40, max: 44, color: "text-orange-500" },
  { grade: "F", min: 0, max: 39, color: "text-red-600" },
];

export function getGrade(score: number) {
  return GRADE_SCALE.find(g => score >= g.min && score <= g.max)?.grade || "F";
}