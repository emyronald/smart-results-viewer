"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function Page() {
  const params = useParams();
  const id = params?.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const s = await get<Student>(`/students/${id}`);
        const r = await get<Result[]>(`/results?studentId=${id}`);
        setStudent(s);
        setResults(r);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading student...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!student) return <div className="p-6 text-gray-300">Student not found</div>;

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
              <div className="text-sm font-mono text-gray-200">{student.id}</div>
            </div>
          </div>

          <h2 className="text-lg font-medium mt-5 -mb-5">Results</h2>
          <StudentResultsClient results={results} />
        </div>
      </div>
    </main>
  );
}
