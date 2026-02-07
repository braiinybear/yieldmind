"use client";
import { useCourseStore } from "@/zustand/root-store-provider";
import { useEffect, useState } from "react";
import { GetEnrollmentsResponse } from "@/app/api/enrollment/route";

// app/(admin)/admin/page.tsx
export default function AdminDashboardPage() {
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const courseData = useCourseStore((state) => state.courseData);
  const [studentCount, setStudentCount] = useState<number>();
  const [enrollmentCount, setEnrollmentCount] = useState<number>();
  const [revenue, setRevenue] = useState<number>();
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch("/api/enrollment");
        const enrollments: GetEnrollmentsResponse = await res.json();

        setEnrollmentCount(enrollments.totalEnrollments);
        setRevenue(
          enrollments?.data?.reduce(
            (total, enrollment) => total + enrollment.Course.price,
            0,
          ),
        );
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        const students = await res.json();

        setStudentCount(students.data.length);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchCourses();
    fetchEnrollments();
    fetchStudents();
  }, [fetchCourses]);

  return (
    <div className="space-y-4 text-black font-sans">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Courses</p>
          <h3 className="text-2xl font-medium font-sans">{courseData?.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Students</p>
          <h3 className="text-2xl font-medium font-sans">{studentCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Active Enrollments</p>
          <h3 className="text-2xl font-medium font-sans">{enrollmentCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Revenue</p>
          <h3 className="text-2xl font-medium font-sans">{revenue}</h3>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-xl font-semibold mb-4">Recent Enrollments</h4>

        <div className="text-gray-600">No recent enrollments</div>
      </div>
    </div>
  );
}
