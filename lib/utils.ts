import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 1. Your Subject Names (to make the chart readable)
const subjectsMap = {
  1: "Mathematics",
  2: "English",
  3: "Physics",
  4: "Biology",
  5: "Chemistry"
} as const satisfies Record<number, string>;

export function calculateSubjectAverages(results: Array<{ scores: Array<{ subjectId: number; total: number }> }>) {
  const tempStats: Record<number, { total: number; count: number }> = {};

  // Step A: Loop through every student
  results.forEach((studentResult) => {
    
    // Step B: Loop through that student's scores
    studentResult.scores.forEach((scoreItem) => {
      const subId = scoreItem.subjectId;

      // Initialize if we haven't seen this subject yet
      if (!tempStats[subId]) {
        tempStats[subId] = { total: 0, count: 0 };
      }

      // Add their score to the pile
      tempStats[subId].total += scoreItem.total;
      tempStats[subId].count += 1;
    });
  });

  // Step C: Convert the stats object into an array for Recharts
  const chartData = Object.keys(tempStats).map((subjectId) => {
    const subjectIdNum = Number(subjectId);
    const stats = tempStats[subjectIdNum];
    return {
      subjectId: subjectIdNum,
      name: subjectsMap[subjectIdNum as keyof typeof subjectsMap] || `Subject ${subjectIdNum}`, // Fallback name
      average: Math.round(stats.total / stats.count), // Calculate Avg
    };
  });

  return chartData;
}

// Map IDs to readable names
const termMap = {
  1: "1st Term",
  2: "2nd Term",
  3: "3rd Term"
};

export function calculateTermAverages(results: Array<{ termId: number; scores: Array<{ total: number }> }>) {
  const termStats: Record<number, { total: number; count: number }> = {};

  // Step A: Loop through every student result
  results.forEach((studentResult) => {
    const tId = studentResult.termId;

    // Initialize bucket if new
    if (!termStats[tId]) {
      termStats[tId] = { total: 0, count: 0 };
    }

    // Step B: Loop through all subjects for this student and add to term total
    studentResult.scores.forEach((score) => {
      termStats[tId].total += score.total;
      termStats[tId].count += 1;
    });
  });

  // Step C: Format for Recharts
  return Object.keys(termStats).map((termId) => {
    const termIdNum = Number(termId);
    return {
      termName: termMap[termIdNum as keyof typeof termMap] || `Term ${termId}`, // X-Axis Label
      average: Math.round(termStats[termIdNum].total / termStats[termIdNum].count), // Y-Axis Value
    };
  });
}