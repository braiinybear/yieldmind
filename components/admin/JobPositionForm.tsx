"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { EmploymentType } from "@prisma/client";
import { useJobPositionStore } from "@/zustand/root-store-provider";
import { toast } from "sonner";

export interface CreateJobPositionPayload {
  title: string;
  description: string;
  department?: string | null;
  location?: string | null;
  employmentType?: EmploymentType;
  experienceRequired?: number | null;
  salaryRange?: string | null;
  isActive?: boolean;

  // from JobPositionWithRelations
  id?: string; // optional if used for edit
  applications?: Array<{
    id: string;
    status: string;
  }>;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

interface JobPositionFormProps {
  onClose: () => void;
  selectedJob: CreateJobPositionPayload | null;
}

export default function JobPositionForm({
  onClose,
  selectedJob,
}: JobPositionFormProps) {
  const [formData, setFormData] = useState<CreateJobPositionPayload>({
    title: selectedJob?.title || "",
    description: selectedJob?.description || "",
    department: selectedJob?.department || "",
    location: selectedJob?.location || "",
    employmentType: selectedJob?.employmentType || "FULL_TIME",
    experienceRequired: selectedJob?.experienceRequired || undefined,
    salaryRange: selectedJob?.salaryRange || "",
    isActive: selectedJob?.isActive ?? true,
  });
  const updateJobPosition = useJobPositionStore(
    (state) => state.updateJobPosition,
  );
  const createJobPosition = useJobPositionStore(
    (state) => state.createJobPosition,
  );
  const loading = useJobPositionStore((state) => state.loading);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedJob && selectedJob.id) {
        await updateJobPosition(selectedJob.id, formData);
        toast.success("Job position updated successfully!");
      } else {
        await createJobPosition(formData);
        toast.success("Job position created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save job position:", error);
      toast.error(selectedJob ? "Failed to update job position" : "Failed to create job position");
    }
  };
  const inputStyle =
    "w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-black shadow-sm \
   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \
   hover:border-blue-400 transition-all duration-200";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  h-full bg-black/70 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed text-black inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-bold">
              {selectedJob ? "Edit Job Position" : "Create Job Position"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                placeholder="Backend Developer"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                placeholder="Job responsibilities and role details"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                placeholder="Engineering"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                placeholder="Dehradun / Remote"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience Required (years)
              </label>
              <input
                type="number"
                name="experienceRequired"
                placeholder="0"
                value={formData.experienceRequired || ""}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                min="0"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Range
              </label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange || ""}
                onChange={handleChange}
                className={`${inputStyle} w-full border px-3 py-2 rounded`}
                placeholder="₹4–6 LPA"
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span className="text-sm">Active (visible to users)</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading.create || loading.update}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(loading.create || loading.update) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {selectedJob ? 
                  (loading.update ? "Updating..." : "Update Job") : 
                  (loading.create ? "Creating..." : "Create Job")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
