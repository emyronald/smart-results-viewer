"use client";

import React, { useRef, useMemo, useState } from "react";
import { post, patch, remove } from "@/lib/api";

type Score = { subjectId: number; ca: number; exam: number; total: number };
type Result = {
  id: number;
  studentId: number;
  sessionId: number;
  termId: number;
  scores: Score[];
};

const SUBJECT_NAMES: Record<number, string> = {
  1: "Mathematics",
  2: "English",
  3: "Biology",
  4: "Chemistry",
  5: "Physics",
};

function getSubjectName(subjectId: number): string {
  return SUBJECT_NAMES[subjectId] || `Subject ${subjectId}`;
}

function getGrade(total: number): { grade: string; color: string } {
  if (total >= 90) return { grade: "A", color: "bg-green-600 text-white" };
  if (total >= 80) return { grade: "B", color: "bg-blue-600 text-white" };
  if (total >= 70) return { grade: "C", color: "bg-cyan-600 text-white" };
  if (total >= 60) return { grade: "D", color: "bg-yellow-600 text-white" };
  return { grade: "F", color: "bg-red-600 text-white" };
}

export default function StudentResultsClient({
  results: initialResults,
}: {
  results: Result[];
}) {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Get unique terms from results
  const uniqueTerms = useMemo(() => {
    return [...new Set(results.map((r) => r.termId))].sort((a, b) => a - b);
  }, [results]);

  // Default to first term if available
  const [selectedTerm, setSelectedTerm] = useState<number>(
    uniqueTerms.length > 0 ? uniqueTerms[0] : 1
  );

  // Filter results for selected term
  const selectedResults = useMemo(() => {
    return results.filter((r) => r.termId === selectedTerm);
  }, [results, selectedTerm]);

  function handlePrint() {
    if (!resultsRef.current) return;
    const content = resultsRef.current.innerHTML;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Student Results - Term ${selectedTerm}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial; padding:20px;} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px;text-align:left} th{background:#f3f4f6}</style>
        </head>
        <body>
          <h2>Results - Term ${selectedTerm}</h2>
          ${content}
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  }

  function handleEditResult(result: Result) {
    setEditingResult(JSON.parse(JSON.stringify(result)));
    setIsEditing(true);
  }

  async function handleSaveResult() {
    if (!editingResult) return;
    setIsSaving(true);
    setError(null);
    try {
      const isNew = !results.some((r) => r.id === editingResult.id);
      if (isNew) {
        // POST new result
        const created = await post<Result>("/results", editingResult);
        setResults((prev) => [...prev, created]);
      } else {
        // PATCH existing result
        await patch<Result>(`/results/${editingResult.id}`, editingResult);
        setResults((prev) =>
          prev.map((r) => (r.id === editingResult.id ? editingResult : r))
        );
      }
      setEditingResult(null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save result");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddResult() {
    const newId = Math.max(...results.map((r) => r.id), 0) + 1;
    const newResult: Result = {
      id: newId,
      studentId: results[0]?.studentId || 1,
      sessionId: 1,
      termId: selectedTerm,
      scores: Array.from({ length: 5 }, (_, i) => ({
        subjectId: i + 1,
        ca: 0,
        exam: 0,
        total: 0,
      })),
    };
    setEditingResult(newResult);
    setIsEditing(true);
  }

  function handleCancel() {
    setEditingResult(null);
    setIsEditing(false);
    setDeleteConfirm(null);
  }

  async function handleDeleteResult(resultId: number) {
    setIsDeleting(true);
    setError(null);
    try {
      await remove(`/results/${resultId}`);
      setResults((prev) => prev.filter((r) => r.id !== resultId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete result");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleScoreChange(
    scoreIndex: number,
    field: "ca" | "exam",
    value: number
  ) {
    if (!editingResult) return;
    const updatedScores = [...editingResult.scores];
    updatedScores[scoreIndex] = {
      ...updatedScores[scoreIndex],
      [field]: value,
      total:
        field === "ca"
          ? value + (updatedScores[scoreIndex].exam || 0)
          : (updatedScores[scoreIndex].ca || 0) + value,
    };
    setEditingResult({ ...editingResult, scores: updatedScores });
  }

  if (results.length === 0) {
    return (
      <div className="mt-6">
        <div className="text-gray-400 mb-4">
          <p>No results available for this student.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleAddResult}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            Add First Result
          </button>
        )}
        {isEditing && editingResult && (
          <div className="bg-gray-800 border border-gray-700 rounded-md p-6 mt-4">
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              Add New Result
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Session ID
                  </label>
                  <input
                    type="number"
                    value={editingResult.sessionId}
                    onChange={(e) =>
                      setEditingResult({
                        ...editingResult,
                        sessionId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Term ID
                  </label>
                  <input
                    type="number"
                    value={editingResult.termId}
                    onChange={(e) =>
                      setEditingResult({
                        ...editingResult,
                        termId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-200 mb-3">
                  Scores
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-gray-800 text-sm border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-3 py-2 text-left">Subject</th>
                        <th className="px-3 py-2 text-right">CA</th>
                        <th className="px-3 py-2 text-right">Exam</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {editingResult.scores.map((s, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2">
                            {getSubjectName(s.subjectId)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <input
                              type="number"
                              value={s.ca}
                              onChange={(e) =>
                                handleScoreChange(
                                  i,
                                  "ca",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-right"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <input
                              type="number"
                              value={s.exam}
                              onChange={(e) =>
                                handleScoreChange(
                                  i,
                                  "exam",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-right"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-green-400 font-medium">
                            {s.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveResult}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Result"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          {uniqueTerms.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                selectedTerm === term
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Term {term}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={handleAddResult}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                Add Result
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Print Results
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && editingResult ? (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-6 mt-4">
          <h3 className="text-lg font-medium text-gray-100 mb-4">
            {results.some((r) => r.id === editingResult.id)
              ? "Edit Result"
              : "Add New Result"}
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Session ID
                </label>
                <input
                  type="number"
                  value={editingResult.sessionId}
                  onChange={(e) =>
                    setEditingResult({
                      ...editingResult,
                      sessionId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Term ID
                </label>
                <input
                  type="number"
                  value={editingResult.termId}
                  onChange={(e) =>
                    setEditingResult({
                      ...editingResult,
                      termId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-200 mb-3">Scores</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-gray-800 text-sm border border-gray-700">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-3 py-2 text-left">Subject</th>
                      <th className="px-3 py-2 text-right">CA</th>
                      <th className="px-3 py-2 text-right">Exam</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {editingResult.scores.map((s, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          {getSubjectName(s.subjectId)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={s.ca}
                            onChange={(e) =>
                              handleScoreChange(
                                i,
                                "ca",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={s.exam}
                            onChange={(e) =>
                              handleScoreChange(
                                i,
                                "exam",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-green-400 font-medium">
                          {s.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleSaveResult}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Result"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div ref={resultsRef} className="mt-4 overflow-auto">
          {selectedResults.map((r) => (
            <div key={r.id} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-200">
                  Term {r.termId} — Session {r.sessionId}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditResult(r)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(r.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <table className="min-w-full table-auto bg-gray-800 text-sm border border-gray-700">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-3 py-2 text-left">Subject</th>
                    <th className="px-3 py-2 text-right">CA</th>
                    <th className="px-3 py-2 text-right">Exam</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {r.scores.map((s, i) => {
                    const { grade, color } = getGrade(s.total);
                    return (
                      <tr key={i} className="hover:bg-gray-700">
                        <td className="px-3 py-2">
                          {getSubjectName(s.subjectId)}
                        </td>
                        <td className="px-3 py-2 text-right">{s.ca}</td>
                        <td className="px-3 py-2 text-right">{s.exam}</td>
                        <td className="px-3 py-2 text-right text-green-400 font-medium">
                          {s.total}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${color}`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-md p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              Delete Result?
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete this result? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteResult(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
