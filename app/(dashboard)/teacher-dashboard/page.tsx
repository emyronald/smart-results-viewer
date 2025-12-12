"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineClient, AreaClient, BarClient } from "@/components/ChartClient";

import { Badge } from "@/components/ui/badge";

import { GraduationCap } from "lucide-react";

import { get } from "@/lib/api";
import { Student, Session, Teacher } from "@/types/types";
import GradeDistributionTable from "@/components/tableClient";

export default function teacherDashboard() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<{
    students: Student[];
    sessions: Session[];
    teachers: Teacher[];
    subjects: string[];
    results: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [students, sessions, teachers, subjects, results] =
          await Promise.all([
            get<Student[]>("/students"),
            get<Session[]>("/sessions"),
            get<Teacher[]>("/teachers"),
            get<string[]>("/subjects"),
            get<any[]>("/results"),
          ]);
        setData({ students, sessions, teachers, subjects, results });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !isLoaded || !data) {
    return <main className="p-8">Loading...</main>;
  }

  const userName = user?.firstName || user?.username || "Teacher";
  const greetingMessage = `Welcome back, ${userName}! 👋`;

  return (
    <main className="p-8">
      <div id="greeting" className="text-2xl font-semibold text-gray-100 mb-6">
        {greetingMessage}
      </div>
      <div className="card-grid w-full">
        <Card className="black-bg text-white border-gray-600">
          <CardHeader className="w-full">
            <CardDescription>
              <Badge className="bg-sky-700">
                {data.sessions[0]?.name || "Session"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-5xl font-bold">
            {data.students.length}
          </CardContent>
          <CardFooter>Number of Students</CardFooter>
        </Card>
        <Card className="black-bg text-white border-gray-600">
          <CardHeader className="w-full">
            <CardDescription>
              <Badge className="bg-sky-700">
                {data.sessions[0]?.name || "Session"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-5xl font-bold">
            {data.teachers.length}
          </CardContent>
          <CardFooter>Number of Teachers</CardFooter>
        </Card>
        <Card className="black-bg text-white border-gray-600">
          <CardHeader className="w-full">
            <CardDescription>
              <Badge className="bg-sky-700">
                {data.sessions[0]?.name || "Session"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-5xl font-bold">
            {data.subjects.length}
          </CardContent>
          <CardFooter>Number of Subjects</CardFooter>
        </Card>
      </div>
      <h2 className="font-bold text-2xl mt-7">Performance Metrics</h2>
      <div className="charts w-full  mt-8 chart-container">
        <div className="chart-card">
          <LineClient data={data.results} />
        </div>
        <div className="chart-card">
          <BarClient data={data.results} />
        </div>
      </div>
      <div className="mt-8 w-full text-center">
        <GradeDistributionTable results={data.results} />
      </div>
    </main>
  );
}
