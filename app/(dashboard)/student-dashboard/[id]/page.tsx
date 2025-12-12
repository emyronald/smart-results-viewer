import { get } from "@/lib/api";

import { Student } from "@/types/types";
import StudentResultsClient from "./StudentResultsClient";

type Score = { subjectId: number; ca: number; exam: number; total: number };
type Result = {
  id: number;
  studentId: number;
  sessionId: number;
  termId: number;
  scores: Score[];
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params; // const id = params;
  const student = await get<Student>(`/students/${id}`);
  const results = await get<Result[]>(`/results?studentId=${id}`);

  return (
    <main className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-md shadow p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold">{student.name}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Class: {(student as any).class}
              </p>
              <p className="text-sm text-gray-400">
                Reg No: {(student as any).regNo ?? "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Student ID</p>
              <div className="text-sm font-mono text-gray-200">
                {student.id}
              </div>
            </div>
          </div>

          <h2 className="text-lg font-medium mt-5 -mb-5">Results</h2>

          <StudentResultsClient results={results} />
        </div>
      </div>
    </main>
  );
}
