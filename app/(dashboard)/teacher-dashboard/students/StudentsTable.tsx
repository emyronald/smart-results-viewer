"use client";

import React, { useEffect, useMemo, useState } from "react";
import { get, remove, post } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Student } from "@/types/types";

type Result = { id: number | string };

export default function StudentsTable() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", regNo: "", class: "" });
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Fetch students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await get<Student[]>("/students");
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students", err);
        toast.error("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return students;
    return students.filter((s) => {
      const name = (s.name ?? "").toLowerCase();
      const reg = ((s as any).regNo ?? "").toString().toLowerCase();
      return name.includes(q) || reg.includes(q);
    });
  }, [students, q]);

  // Delete student and results
  async function handleDelete(e: React.MouseEvent, studentId: string) {
    e.stopPropagation();
    const ok = window.confirm(
      "Are you sure you want to delete this student and all their results? This action cannot be undone."
    );
    if (!ok) return;

    try {
      setIsDeletingId(studentId);

      const results = await get<Result[]>(`/results?studentId=${studentId}`);

      await Promise.all(
        results.map((r) =>
          remove(`/results/${r.id}`).catch((err) =>
            console.warn("Failed to delete result", r.id, err)
          )
        )
      );

      await remove(`/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));

      toast.success("Student and their results deleted");
    } catch (err: any) {
      console.error("Delete error", err);
      toast.error(
        err?.message ?? "Failed to delete student. Please try again."
      );
    } finally {
      setIsDeletingId(null);
    }
  }

  // Create new student
  async function handleCreateStudent() {
    if (!formData.name.trim() || !formData.regNo.trim() || !formData.class.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsCreating(true);

      const allStudents = await get<Student[]>("/students");

      const existingByRegNo = allStudents.some(
        (s) => (s as any).regNo === formData.regNo
      );
      if (existingByRegNo) {
        toast.error("Student with this registration number already exists");
        return;
      }

      const existingByNameAndClass = allStudents.some(
        (s) =>
          s.name.toLowerCase() === formData.name.toLowerCase() &&
          (s as any).class === formData.class
      );
      if (existingByNameAndClass) {
        toast.error("Student already exists in this class");
        return;
      }

      const created = await post<Student>("/students", formData);
      setStudents((prev) => [...prev, created]);

      toast.success(`Student ${created.name} created successfully!`);
      setFormData({ name: "", regNo: "", class: "" });
      setShowForm(false);
    } catch (err: any) {
      console.error("Create student error", err);
      toast.error(
        err?.message ?? "Failed to create student. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (loading) return <div className="text-white p-6">Loading students...</div>;

  return (
    <div className="black-bg shadow-sm rounded-md overflow-hidden border-gray-600 border">
      {/* Search & Create */}
      <div className="p-4 border-b flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or reg no..."
          className="flex-1 px-3 py-2 rounded-md border border-gray-600 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={() => setQuery("")}
          className="px-3 py-2 text-sm text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Clear
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          + New Student
        </button>
      </div>

      {/* New Student Form */}
      {showForm && (
        <div className="p-4 border-b bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Registration No"
              value={formData.regNo}
              onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
              className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Class</option>
              <option value="JSS1">JSS1</option>
              <option value="JSS2">JSS2</option>
              <option value="JSS3">JSS3</option>
              <option value="SSS1">SSS1</option>
              <option value="SSS2">SSS2</option>
              <option value="SSS3">SSS3</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateStudent}
              disabled={isCreating}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({ name: "", regNo: "", class: "" });
              }}
              className="px-4 py-2 text-sm text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-600">Student</th>
              <th className="text-left px-4 py-3 text-xs text-gray-600 hidden md:table-cell">Reg No</th>
              <th className="text-left px-4 py-3 text-xs text-gray-600 hidden md:table-cell">Class</th>
              <th className="text-left px-4 py-3 text-xs text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-gray-700 cursor-pointer"
                tabIndex={0}
                onClick={() => router.push(`/teacher-dashboard/students/${s.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
                      {s.name
                        .split(" ")
                        .map((n) => n?.[0] ?? "")
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{s.name}</div>
                      <div className="text-xs text-gray-500">{(s as any).email ?? ""}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-200 hidden md:table-cell">
                  {(s as any).regNo ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm hidden md:table-cell">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {(s as any).class}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/teacher-dashboard/students/${s.id}`);
                    }}
                    className="text-indigo-400 hover:underline text-sm"
                  >
                    Open
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, s.id)}
                    disabled={isDeletingId === s.id}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    {isDeletingId === s.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
