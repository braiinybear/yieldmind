"use client";

import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  IndianRupee,
  Search,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { useJobPositionStore } from "@/zustand/root-store-provider";
import { useEffect, useState } from "react";

export default function CareersPage() {
  // Job Position Store hooks
  const jobPositions = useJobPositionStore((state) => state.JobPositionData);
  const fetchJobPositions = useJobPositionStore(
    (state) => state.fetchJobPositions,
  );
  const loading = useJobPositionStore((state) => state.loading);
  const error = useJobPositionStore((state) => state.error);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");

  useEffect(() => {
    fetchJobPositions();
  }, [fetchJobPositions]);

  // Filter only active job positions
  const activeJobs = jobPositions.filter((job) => job.isActive);

  // Get unique departments and employment types for filter options
  const departments = Array.from(
    new Set(activeJobs.map((job) => job.department).filter(Boolean)),
  );
  const employmentTypes = Array.from(
    new Set(activeJobs.map((job) => job.employmentType)),
  );

  // Filter jobs based on search criteria
  const filteredJobs = activeJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesDepartment =
      !selectedDepartment || job.department === selectedDepartment;

    const matchesEmploymentType =
      !selectedEmploymentType || job.employmentType === selectedEmploymentType;

    return matchesSearch && matchesDepartment && matchesEmploymentType;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setSelectedEmploymentType("");
  };

  const hasActiveFilters =
    searchQuery || selectedDepartment || selectedEmploymentType;

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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-24 bg-card border-b border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
        <div className="container-premium relative z-20">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-block px-4 py-1 border border-primary/20 bg-primary/5">
                <span className="text-primary font-accent text-sm tracking-wider uppercase">
                  We&apos;re Hiring
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Join Our <span className="text-gold-gradient">Team</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Be part of a passionate team dedicated to shaping the future of
                creative education.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding relative z-10">
        <div className="container-premium">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-8">Open Positions</h2>

            {/* Search and Filter Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  Find Your Perfect Role
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, department, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Department Filter */}
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department || ""}>
                      {department}
                    </option>
                  ))}
                </select>

                {/* Employment Type Filter */}
                <select
                  value={selectedEmploymentType}
                  onChange={(e) => setSelectedEmploymentType(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Types</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {getEmploymentTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters and Clear Button */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Search: &quot;{searchQuery}&quot;
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {selectedDepartment && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Department: {selectedDepartment}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedDepartment("")}
                        />
                      </Badge>
                    )}
                    {selectedEmploymentType && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        Type: {getEmploymentTypeLabel(selectedEmploymentType)}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedEmploymentType("")}
                        />
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {loading.fetch ? (
                  "Loading jobs..."
                ) : (
                  <>
                    Showing {filteredJobs.length} of {activeJobs.length}{" "}
                    available position{activeJobs.length !== 1 ? "s" : ""}
                    {hasActiveFilters && ` matching your criteria`}
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>

          {loading.fetch ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">
                  Loading job positions...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">Failed to load job positions</p>
              <Button onClick={() => fetchJobPositions()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">No Open Positions</h3>
              <p className="text-muted-foreground">
                We don&apos;t have any open positions at the moment, but
                we&apos;re always looking for talented individuals.
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">No Jobs Found</h3>
              <p className="text-muted-foreground mb-4">
                No positions match your current search criteria. Try adjusting
                your filters or search terms.
              </p>
              <Button
                className="hover:text-black"
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job, idx) => (
                <AnimatedSection key={job.id} delay={idx * 0.1}>
                  <div className="group border border-border bg-card p-6 md:p-8 hover:border-primary transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {job.department || "General"}
                      </span>
                      <h3 className="text-2xl font-bold">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>
                            {getEmploymentTypeLabel(job.employmentType)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location || "Location TBD"}</span>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            <span>{job.salaryRange}</span>
                          </div>
                        )}
                        {job.experienceRequired && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.experienceRequired} years exp</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div>
                      <Link href={`/careers/${job.id}`}>
                        <Button
                          variant="outline"
                          className="border-primary/50 hover:bg-primary hover:text-primary-foreground group-hover:border-primary"
                        >
                          View Job
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.4}>
            <div className="mt-16 p-8 md:p-12 bg-primary/5 border border-primary/20 text-center rounded-sm">
              <h3 className="text-2xl font-bold mb-4">
                Don&apos;t see a suitable role?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                We are always looking for talented individuals. Send your resume
                and portfolio to careers@yieldmind.academy and we&apos;ll keep
                you in mind for future opportunities.
              </p>
              <Link
                href="mailto:careers@yieldmind.academy"
                className="text-primary font-semibold hover:underline"
              >
                Email Us Your Resume
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
