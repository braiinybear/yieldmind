"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Briefcase,
  Users,
  Calendar,
  MapPin,
  Clock,

  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  FileText,
  
  IndianRupeeIcon,
} from "lucide-react";
import JobPositionForm from "@/components/admin/JobPositionForm";
import { useJobPositionStore } from "@/zustand/root-store-provider";
import { CreateJobPositionPayload } from "@/components/admin/JobPositionForm";
import { toast } from "sonner";
import { JobPositionWithRelations } from "@/app/api/jobpositions/route";

// Mock data for applicants
const mockApplicants = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    jobTitle: "Senior Frontend Developer",
    qualification: "Bachelor's in Computer Science",
    experience: 5,
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
    status: "SHORTLISTED",
    appliedAt: "2025-01-18",
    resumeUrl: "/resumes/john-doe.pdf",
    coverLetter: "I am excited to apply for this position...",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 234 567 8901",
    jobTitle: "Marketing Manager",
    qualification: "MBA in Marketing",
    experience: 3,
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    status: "APPLIED",
    appliedAt: "2025-01-16",
    resumeUrl: "/resumes/jane-smith.pdf",
    coverLetter: "With my marketing background...",
  },
  {
    id: 3,
    fullName: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 234 567 8902",
    jobTitle: "Content Writer",
    qualification: "Bachelor's in English",
    experience: 2,
    skills: ["Content Writing", "SEO", "Social Media", "Copywriting"],
    status: "REJECTED",
    appliedAt: "2025-01-22",
    resumeUrl: "/resumes/bob-johnson.pdf",
    coverLetter: "I am passionate about creating compelling content...",
  },
];

export default function HiringPage() {
  const [activeTab, setActiveTab] = useState<string>("positions");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedJob, setSelectedJob] =
    useState<JobPositionWithRelations | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Store hooks
  const jobPositions = useJobPositionStore((state) => state.JobPositionData);
  const deleteJobPosition = useJobPositionStore(
    (state) => state.deleteJobPosition,
  );
  const fetchJobPositions = useJobPositionStore(
    (state) => state.fetchJobPositions,
  );
  const loading = useJobPositionStore((state) => state.loading);
  const error = useJobPositionStore((state) => state.error);

  useEffect(() => {
    fetchJobPositions();
  }, [fetchJobPositions]);

  const handleNewJob = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: JobPositionWithRelations) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedJob(null);
    setIsFormOpen(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job position?")) {
      try {
        await deleteJobPosition(jobId);
        toast.success("Job position deleted successfully!");
      } catch (error) {
        console.error("Failed to delete job position:", error);
        toast.error("Failed to delete job position");
      }
    }
  };

  // Filter job positions based on search term, department, and employment type
  const filteredJobPositions = jobPositions.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department &&
        job.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.location &&
        job.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment =
      !selectedDepartment ||
      selectedDepartment === "all" ||
      (job.department &&
        job.department.toLowerCase() === selectedDepartment.toLowerCase());

    const matchesEmploymentType =
      !selectedEmploymentType ||
      selectedEmploymentType === "all" ||
      job.employmentType === selectedEmploymentType;

    return matchesSearch && matchesDepartment && matchesEmploymentType;
  });

  // Get unique departments for filter dropdown
  const uniqueDepartments = [
    ...new Set(
      jobPositions
        .map((job) => job.department)
        .filter((dept) => dept !== null && dept !== undefined),
    ),
  ];

  // Pagination logic
  const totalPages = Math.ceil(filteredJobPositions.length / ITEMS_PER_PAGE);

  // Reset to first page if current page exceeds total pages (when filters change)
  const effectiveCurrentPage =
    currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

  const startIndex = (effectiveCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedJobPositions = filteredJobPositions.slice(
    startIndex,
    endIndex,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of job list
    document
      .getElementById("jobs-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusColor = (status: string, isActive?: boolean) => {
    if (typeof isActive !== "undefined") {
      // For job positions
      return isActive
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800";
    }

    // For applicant status
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Full-time";
      case "PART_TIME":
        return "Part-time";
      case "INTERNSHIP":
        return "Internship";
      case "CONTRACT":
        return "Contract";
      default:
        return type;
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            className=" bg-black text-white hover:bg-zinc-900 transition-all duration-150 active:scale-95 active:translate-y-px"
            onClick={handleNewJob}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job Position
          </Button>
        </div>
      </div>

      {/* Job Creation Form */}
      {isFormOpen && (
        <JobPositionForm
          selectedJob={selectedJob as CreateJobPositionPayload | null}
          onClose={handleCloseForm}
        />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white text-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Positions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobPositions.length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Positions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobPositions.filter((job) => job.isActive).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockApplicants.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    mockApplicants.filter((app) => app.status === "SHORTLISTED")
                      .length
                  }
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white grid w-full grid-cols-2">
          <TabsTrigger
            value="positions"
            className="
      flex items-center gap-2
      bg-white text-black
      data-[state=active]:bg-black
      data-[state=active]:text-white
    "
          >
            <Briefcase className="w-4 h-4" />
            Job Positions ({filteredJobPositions.length})
          </TabsTrigger>

          <TabsTrigger
            value="applicants"
            className="
      flex items-center gap-2
      bg-white text-black
      data-[state=active]:bg-black
      data-[state=active]:text-white
    "
          >
            <Users className="w-4 h-4" />
            All Applicants ({mockApplicants.length})
          </TabsTrigger>
        </TabsList>

        {/* Job Positions Tab */}
        <TabsContent value="positions" className="space-y-4 text-black">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search job positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          {/* Pagination Info */}
          {filteredJobPositions.length > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredJobPositions.length)} of{" "}
                {filteredJobPositions.length} job positions
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* Jobs Grid */}
          <div id="jobs-grid" className="grid gap-4">
            {loading.fetch ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 mx-auto" />
                  <p className="mt-4 text-slate-600">Loading Jobpositions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {error}</p>
              </div>
            ) : filteredJobPositions.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm || selectedDepartment || selectedEmploymentType ? (
                  <div>
                    <p className="text-gray-600 mb-2">
                      No job positions match your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedDepartment("");
                        setSelectedEmploymentType("");
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <p>No job positions found.</p>
                )}
              </div>
            ) : (
              paginatedJobPositions.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow bg-white text-black"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <Badge className={getStatusColor("", job.isActive)}>
                            {job.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.department || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getEmploymentTypeLabel(job.employmentType)}
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupeeIcon className="w-4 h-4" />
                            {job.salaryRange || "N/A"}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applications?.length || 0} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {job.experienceRequired || 0} years exp required
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4 lg:mt-0">
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-zinc-900 transition-all duration-150 active:scale-95 active:translate-y-px">
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-zinc-900 transition-all duration-150 active:scale-95 active:translate-y-px"
                          onClick={() => handleEditJob(job)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => handleDeleteJob(job.id)}
                          size="sm"
                          className="bg-black text-white hover:bg-zinc-900 transition-all duration-150 active:scale-95 active:translate-y-px"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {/* Previous Button */}
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="disabled:opacity-50 text-white bg-black hover:bg-zinc-900 transition-transform duration-150 active:scale-95"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!shouldShow) {
                      // Show ellipsis
                      if (page === 2 && currentPage > 4) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      if (
                        page === totalPages - 1 &&
                        currentPage < totalPages - 3
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`min-w-10 
                        
                          bg-black text-white  hover:bg-zinc-900 transition-transform duration-150 active:scale-95
                      `}
                      >
                        {page}
                      </Button>
                    );
                  },
                )}
              </div>

              {/* Next Button */}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="disabled:opacity-50 bg-black text-white hover:bg-zinc-900 transition-transform duration-150 active:scale-95"
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* All Applicants Tab */}
        <TabsContent value="applicants" className="space-y-4 text-black">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>All Positions</option>
              <option>Senior Frontend Developer</option>
              <option>Marketing Manager</option>
              <option>Content Writer</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>All Status</option>
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Rejected</option>
              <option>Hired</option>
            </select>
            <Button className="text-white bg-black  active:scale-95  hover:bg-zinc-900  transition-transform duration-150">
              <Download className="w-4 h-4 mr-2 " />
              Export
            </Button>
          </div>

          {/* Applicants Grid */}
          <div className="grid gap-4">
            {mockApplicants.map((applicant) => (
              <Card
                key={applicant.id}
                className="hover:shadow-lg transition-shadow bg-white text-black"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {applicant.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {applicant.jobTitle}
                          </p>
                        </div>
                        <Badge className={getStatusColor(applicant.status)}>
                          {applicant.status.toLowerCase().replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {applicant.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {applicant.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {applicant.qualification}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Experience:</span>{" "}
                          {applicant.experience} years
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Applied on {applicant.appliedAt}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-black text-white   hover:bg-zinc-900  transition-transform duration-150 active:scale-95"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                        <Button
                          size="sm"
                          className="bg-black hover:bg-zinc-900 text-white  transition-transform duration-150 active:scale-95"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      <select className="px-3 py-1 text-sm border border-gray-300 rounded-md">
                        <option>Update Status</option>
                        <option>Applied</option>
                        <option>Shortlisted</option>
                        <option>Rejected</option>
                        <option>Hired</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
