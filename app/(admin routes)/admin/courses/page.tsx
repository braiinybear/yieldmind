"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Course } from "@prisma/client";

import CourseForm from "../../../../components/admin/CourseForm";

import { useCourseStore } from "@/zustand/root-store-provider";
import { toast } from "sonner";

/* ---------- Helpers ---------- */

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ---------- Page ---------- */

export default function AdminCoursePage() {
  /* ---------- Router ---------- */
  const router = useRouter();

  /* ---------- Zustand Store ---------- */
  const courses = useCourseStore((state) => state.courseData ?? []);

  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const fetchloading = useCourseStore((state) => state.loading.fetch);
  const deleteLoading = useCourseStore((state) => state.loading.delete);
  const deleteCourse = useCourseStore((state) => state.deleteCourse);

  /* ---------- Local UI State ---------- */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- Pagination ---------- */
  const itemsPerPage = 10;
  const totalPages = Math.ceil((courses?.length ?? 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = courses?.slice(startIndex, endIndex) ?? [];

  /* ---------- Effects ---------- */
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ---------- Handlers ---------- */

  const handleDeleteCourse = async (id: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) return;

    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Delete error:", error);
    }
  };

  /* ---------- Loading ---------- */

  if (fetchloading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Total Courses
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {courses.length} courses available
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCourse(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2  text-white hover:bg-zinc-900"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white shadow text-black ">
        <table className="min-w-275 w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Price
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Type
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Start Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Duration
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-700">
                Batch Size
              </th>
              <th className="px-6 py-3 text-center font-medium text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedCourses?.map((course, index) => (
              <tr
                key={course.id || `course-${index}`}
                className="hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{course.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.description?.slice(0, 40)}...
                  </p>
                </td>

                <td className="px-6 py-4">₹{(course.price || 0).toFixed(2)}</td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                    {course.type}
                  </span>
                </td>

                <td className="px-6 py-4">{formatDate(course.startDate)}</td>

                <td className="px-6 py-4">{course.duration || "N/A"}</td>

                <td className="px-6 py-4">{course.batchSize || "N/A"}</td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsFormOpen(true);
                      }}
                      className="rounded p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => router.push(`/admin/courses/${course.id}`)}
                      className="rounded p-2 text-green-600 hover:bg-green-50"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      disabled={deleteLoading}
                      className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow">
        <div className="text-sm text-slate-600">
          Showing {startIndex + 1}-{Math.min(endIndex, courses?.length ?? 0)} of{" "}
          {courses?.length ?? 0} courses
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded p-2 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded p-2 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Course Form Modal */}
      {isFormOpen && (
        <CourseForm
          course={selectedCourse}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCourse(undefined);
          }}
        />
      )}
    </div>
  );
}
