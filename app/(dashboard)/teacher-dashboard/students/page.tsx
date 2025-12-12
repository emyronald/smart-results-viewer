"use client";

import StudentsTable from "./StudentsTable";

export default function Page() {
  return (
    <main className="p-6 bg-gray-600 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Class List</h1>
            <p className="text-sm text-gray-300">
              All students across your classes
            </p>
          </div>
        </div>

        {/* StudentsTable now fetches data itself */}
        <StudentsTable />
      </div>
    </main>
  );
}
