"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Course } from "@prisma/client";
import { useCourseStore } from "@/zustand/root-store-provider";
import { toast } from "sonner";
import { createSlug } from "@/lib/formatters";

export interface CourseFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  instructorName: string;
  instructorBio: string;
  thumbnail: string;
  demoVideo: string;
  price: number;
  difficulty: string;
  type: string;
  venue: string;
  startDate: Date | null;
  batchSize: number | null;
  duration: string;
  includes: string[];
  learningOutcomes: string[];
  requirements: string[];
}

interface CourseWithModules extends Course {
  modules?: CourseModule[];
}

interface CourseFormProps {
  course?: CourseWithModules;
  onClose: () => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  isFree: boolean;
  order: number;
}

interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

// Payload types for API
interface LessonPayload {
  title: string;
  description: string | null;
  videoUrl: string | null;
  isFree: boolean;
  order: number;
}

interface ModulePayload {
  title: string;
  order: number;
  lessons: LessonPayload[];
}

interface CoursePayload {
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  instructorName: string | null;
  instructorBio: string | null;
  thumbnail: string | null;
  demoVideo: string | null;
  price: number;
  difficulty: string;
  type: string;
  venue: string | null;
  startDate: string | null;
  batchSize: number | null;
  duration: string | null;
}

export interface CourseInformationPayload {
  includes: string[];
  learningOutcomes: string[];
  requirements: string[];
}

export interface CreateCoursePayload {
  course: CoursePayload;
  modules: ModulePayload[];
  information: CourseInformationPayload;
}

export default function CourseForm({
  course,
  onClose,
}: CourseFormProps) {
  const createCourse = useCourseStore((state) => state.createCourse);
  const updateCourse = useCourseStore((state) => state.updateCourse);
  const fetchCourse = useCourseStore((state) => state.fetchCourses);
  const createLoading = useCourseStore((state) => state.loading.create);
  const updateLoading = useCourseStore((state) => state.loading.update);

  const [formData, setFormData] = useState(() => ({
    title: course?.title || "",
    slug: course?.slug || "",
    shortDescription: course?.shortDescription || "",
    description: course?.description || "",
    instructorName: course?.instructorName || "",
    instructorBio: course?.instructorBio || "",
    thumbnail: course?.thumbnail || "",
    demoVideo: course?.demoVideo || "",
    price: course?.price?.toString() || "",
    difficulty: course?.difficulty || "BEGINNER",
    type: course?.type || "ONLINE",
    venue: course?.venue || "",
    startDate: course?.startDate
      ? new Date(course.startDate).toISOString().split("T")[0]
      : "",
    batchSize: course?.batchSize?.toString() || "",
    duration: course?.duration || "",
    includes: [],
    learningOutcomes: [],
    requirements: [],
  }));

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loadingModules, setLoadingModules] = useState(() => !!(course?.id && course?.modules));

  // Initialize modules when editing a course
  useEffect(() => {
    if (course?.id && course?.modules) {
      // Simulate async loading with delay
      const timer = setTimeout(() => {
        setModules(course.modules || []);
        // Auto-expand first module for better UX
        if (course.modules && course.modules.length > 0) {
          setExpandedModule(course.modules[0].id);
        }
        setLoadingModules(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [course?.id, course?.modules]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && {
        slug: createSlug(value),
      }),
    }));
  };

  const addModule = () => {
    const newModule: CourseModule = {
      id: Date.now().toString(),
      title: "",
      order: modules.length + 1,
      lessons: [],
    };
    setModules([...modules, newModule]);
    setExpandedModule(newModule.id);
  };

  const updateModule = (moduleId: string, field: string, value: string | number) => {
    setModules(
      modules.map((mod) =>
        mod.id === moduleId ? { ...mod, [field]: value } : mod,
      ),
    );
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter((mod) => mod.id !== moduleId));
  };

  const addLessonToModule = (moduleId: string) => {
    setModules(
      modules.map((mod) => {
        if (mod.id === moduleId) {
          const newLesson: Lesson = {
            id: Date.now().toString(),
            title: "",
            description: "",
            videoUrl: "",
            isFree: false,
            order: mod.lessons.length + 1,
          };
          return { ...mod, lessons: [...mod.lessons, newLesson] };
        }
        return mod;
      }),
    );
  };

  const updateLesson = (
    moduleId: string,
    lessonId: string,
    field: string,
    value: string | number | boolean,
  ) => {
    setModules(
      modules.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            lessons: mod.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson,
            ),
          };
        }
        return mod;
      }),
    );
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            lessons: mod.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return mod;
      }),
    );
  };

  // Helper functions for array fields
  const addArrayItem = (field: 'includes' | 'learningOutcomes' | 'requirements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field: 'includes' | 'learningOutcomes' | 'requirements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const deleteArrayItem = (field: 'includes' | 'learningOutcomes' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payload: CreateCoursePayload = {
        course: {
          title: formData.title,
          slug: formData.slug || createSlug(formData.title),
          shortDescription: formData.shortDescription && formData.shortDescription.trim() ? formData.shortDescription : null,
          description: formData.description,
          instructorName: formData.instructorName && formData.instructorName.trim() ? formData.instructorName : null,
          instructorBio: formData.instructorBio && formData.instructorBio.trim() ? formData.instructorBio : null,
          thumbnail: formData.thumbnail && formData.thumbnail.trim() ? formData.thumbnail : null,
          demoVideo: formData.demoVideo && formData.demoVideo.trim() ? formData.demoVideo : null,
          price: parseFloat(formData.price) || 0,
          difficulty: formData.difficulty,
          type: formData.type,
          venue: formData.venue && formData.venue.trim() ? formData.venue : null,
          startDate: formData.startDate || null,
          batchSize: formData.batchSize ? parseInt(formData.batchSize, 10) : null,
          duration: formData.duration && formData.duration.trim() ? formData.duration : null,
        },
        modules: modules.map(mod => ({
          title: mod.title,
          order: mod.order,
          lessons: mod.lessons.map(lesson => ({
            title: lesson.title,
            description: lesson.description || null,
            videoUrl: lesson.videoUrl || null,
            isFree: lesson.isFree,
            order: lesson.order,
          })),
        })),
        information: {
          includes: formData.includes,
          learningOutcomes: formData.learningOutcomes,
          requirements: formData.requirements,
        },
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      // Check if editing or creating
      if (course?.id) {
        await updateCourse(course.id, payload);
        await fetchCourse()
        toast.success("Course updated successfully!");
      } else {
        await createCourse(payload);
        await fetchCourse()
        toast.success("Course created successfully!");
      }

      onClose();
    } catch (error) {
      toast.error("Failed to save course");
      console.error("Submit error:", error);
    }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className=" h-full fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="text-black fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">
              {course ? "Edit Course" : "Create New Course"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Information Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Course Information
              </h3>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-generated from title"
                />
              </div>

              {/* Short Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary for course cards"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course description"
                />
              </div>

              {/* Thumbnail */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Demo Video */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Demo Video URL
                </label>
                <input
                  type="url"
                  name="demoVideo"
                  value={formData.demoVideo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/demo.mp4"
                />
              </div>

              {/* Instructor Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter instructor name"
                />
              </div>

              {/* Instructor Bio */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructor Bio
                </label>
                <textarea
                  name="instructorBio"
                  value={formData.instructorBio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter instructor biography"
                />
              </div>

              {/* Price and Type Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className="text-black" value="BEGINNER">
                      Beginner
                    </option>
                    <option className="text-black" value="INTERMEDIATE">
                      Intermediate
                    </option>
                    <option className="text-black" value="ADVANCED">
                      Advanced
                    </option>
                  </select>
                </div>
              </div>

              {/* Course Type and Venue Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Course Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option className="text-black" value="ONLINE">
                      Online
                    </option>
                    <option className="text-black" value="OFFLINE">
                      Offline
                    </option>
                    <option className="text-black" value="HYBRID">
                      Hybrid
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter venue location"
                  />
                </div>
              </div>

              {/* Start Date and Duration Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 text-black py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4 weeks"
                  />
                </div>
              </div>

              {/* Batch Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Batch Size
                </label>
                <input
                  type="number"
                  name="batchSize"
                  value={formData.batchSize}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border text-black border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            {/* Course Information Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Additional Course Information
              </h3>

              {/* What's Included */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    What's Included
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('includes')}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    <Plus size={14} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.includes.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">
                      No items added. Click "Add Item" to add what's included in this course.
                    </p>
                  ) : (
                    formData.includes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('includes', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Lifetime access to course materials"
                        />
                        <button
                          type="button"
                          onClick={() => deleteArrayItem('includes', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Learning Outcomes
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('learningOutcomes')}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    <Plus size={14} />
                    Add Outcome
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.learningOutcomes.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">
                      No outcomes added. Click "Add Outcome" to add what students will learn.
                    </p>
                  ) : (
                    formData.learningOutcomes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('learningOutcomes', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Master core concepts and principles"
                        />
                        <button
                          type="button"
                          onClick={() => deleteArrayItem('learningOutcomes', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Requirements
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    <Plus size={14} />
                    Add Requirement
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">
                      No requirements added. Click "Add Requirement" to add prerequisites.
                    </p>
                  ) : (
                    formData.requirements.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Basic computer knowledge"
                        />
                        <button
                          type="button"
                          onClick={() => deleteArrayItem('requirements', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Course Modules Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Course Modules
                </h3>
                <button
                  type="button"
                  onClick={addModule}
                  disabled={loadingModules}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  Add Module
                </button>
              </div>

              {loadingModules ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 mx-auto" />
                    <p className="mt-2 text-sm text-slate-600">Loading modules...</p>
                  </div>
                </div>
              ) : modules.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No modules added yet. Click &ldquo;Add Module&rdquo; to get
                  started.
                </p>
              ) : (
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                    >
                      {/* Module Header */}
                      <div className="flex items-center gap-3 p-4 bg-slate-100 border-b border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedModule(
                              expandedModule === module.id ? null : module.id,
                            )
                          }
                          className="hover:bg-slate-200 p-1 rounded transition-colors"
                        >
                          {expandedModule === module.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) =>
                            updateModule(module.id, "title", e.target.value)
                          }
                          className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Module title"
                        />

                        <input
                          type="number"
                          value={module.order}
                          onChange={(e) =>
                            updateModule(
                              module.id,
                              "order",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-20 px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Order"
                          min="1"
                        />

                        <button
                          type="button"
                          onClick={() => deleteModule(module.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Module Content - Lessons */}
                      {expandedModule === module.id && (
                        <div className="p-4 space-y-4 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-slate-700">
                              Lessons
                            </p>
                            <button
                              type="button"
                              onClick={() => addLessonToModule(module.id)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            >
                              <Plus size={14} />
                              Add Lesson
                            </button>
                          </div>

                          {module.lessons.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-2">
                              No lessons added. Click &ldquo;Add Lesson&rdquo;
                              to add one.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2"
                                >
                                  {/* Lesson Title */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) =>
                                        updateLesson(
                                          module.id,
                                          lesson.id,
                                          "title",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Lesson title"
                                    />
                                  </div>

                                  {/* Lesson Description */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={lesson.description}
                                      onChange={(e) =>
                                        updateLesson(
                                          module.id,
                                          lesson.id,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Lesson description"
                                      rows={2}
                                    />
                                  </div>

                                  {/* Video URL */}
                                  <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                      Video URL
                                    </label>
                                    <input
                                      type="url"
                                      value={lesson.videoUrl}
                                      onChange={(e) =>
                                        updateLesson(
                                          module.id,
                                          lesson.id,
                                          "videoUrl",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="https://example.com/video.mp4"
                                    />
                                  </div>

                                  {/* Order and Free Checkbox */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Order
                                      </label>
                                      <input
                                        type="number"
                                        value={lesson.order}
                                        onChange={(e) =>
                                          updateLesson(
                                            module.id,
                                            lesson.id,
                                            "order",
                                            parseInt(e.target.value),
                                          )
                                        }
                                        className="w-full px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                      />
                                    </div>
                                    <div className="flex items-end">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={lesson.isFree}
                                          onChange={(e) =>
                                            updateLesson(
                                              module.id,
                                              lesson.id,
                                              "isFree",
                                              e.target.checked,
                                            )
                                          }
                                          className="w-4 h-4 rounded"
                                        />
                                        <span className="text-xs font-medium text-slate-700">
                                          Free
                                        </span>
                                      </label>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteLesson(module.id, lesson.id)
                                      }
                                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors justify-self-end"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={createLoading || updateLoading}
                className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading || updateLoading}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(createLoading || updateLoading) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {course ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
