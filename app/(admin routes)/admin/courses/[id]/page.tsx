"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Clock,
  MapPin,
  BookOpen,
  Video,
} from "lucide-react";
import { Course } from "@prisma/client";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  isFree: boolean;
  order: number;
}

interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseWithModules extends Course {
  modules?: CourseModule[];
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/course/${courseId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await res.json();
        setCourse(data.data);

        // Auto-expand first module
        if (data.data.modules && data.data.modules.length > 0) {
          setExpandedModules(new Set([data.data.modules[0].id]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-slate-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error || "Course not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>
      </div>

      {/* Course Hero Section */}
      <div className="rounded-lg overflow-hidden bg-white shadow-lg">
        {course?.thumbnail && (
          <div className="relative h-64 md:h-80 w-full bg-slate-200 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-fit"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Course Info Card */}
        <div className="p-6 md:p-8 bg-linear-to-br from-slate-50 to-white">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {course.title}
          </h1>
          <p className="text-slate-600 text-lg mb-6">{course.description}</p>

          {/* Course Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <DollarSign size={18} />
                <span className="text-sm font-medium">Price</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                ₹{(course.price || 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <BookOpen size={18} />
                <span className="text-sm font-medium">Type</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{course.type}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Users size={18} />
                <span className="text-sm font-medium">Batch Size</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {course.batchSize || "Unlimited"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                {course.duration || "N/A"}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {course.startDate && (
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-slate-600">Start Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(course.startDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {course.venue && (
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                <MapPin className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-slate-600">Venue</p>
                  <p className="font-semibold text-slate-900">{course.venue}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Modules Section */}
      {course.modules && course.modules.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Course Content
          </h2>

          <div className="space-y-4">
            {course.modules
              .sort((a, b) => a.order - b.order)
              .map((module) => (
                <div
                  key={module.id}
                  className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-blue-600" size={20} />
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {module.lessons.length} lesson
                          {module.lessons.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-slate-600 transition-transform ${
                        expandedModules.has(module.id) ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Lessons List */}
                  {expandedModules.has(module.id) && (
                    <div className="bg-white p-4 space-y-3 border-t border-slate-200">
                      {module.lessons.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">
                          No lessons available
                        </p>
                      ) : (
                        module.lessons
                          .sort((a, b) => a.order - b.order)
                          .map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <div className="shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 mb-1">
                                  {lesson.title}
                                </h4>
                                {lesson.description && (
                                  <p className="text-sm text-slate-600 mb-2">
                                    {lesson.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2">
                                  {lesson.videoUrl && (
                                    <a
                                      href={lesson.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                      <Video size={14} />
                                      Watch Video
                                    </a>
                                  )}
                                  {lesson.isFree && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                      Free
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!course.modules || course.modules.length === 0) && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <BookOpen className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Course Content Yet
          </h3>
          <p className="text-slate-600">
            This course doesn&apos;t have any modules or lessons yet.
          </p>
        </div>
      )}
    </div>
  );
}
