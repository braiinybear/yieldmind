"use client";

import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Briefcase, 
  IndianRupee, 
  Calendar,
  Users,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { JobPositionWithRelations } from "@/app/api/jobpositions/route";
import { useJobApplicationStore } from "@/zustand/root-store-provider";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Job data state
  const [jobPosition, setJobPosition] = useState<JobPositionWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store access
  const { 
    JobApplicationData,
    fetchJobApplications 
  } = useJobApplicationStore((state) => state);

  const jobId = params.id as string;

  // Check if user has already applied
  const hasApplied = JobApplicationData.some(
    (application) => application.jobId === jobId
  );

  useEffect(() => {
    const fetchJobPosition = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/jobpositions/${jobId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Job position not found");
          }
          throw new Error("Failed to fetch job position");
        }

        const data = await res.json();
        setJobPosition(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const initializePage = async () => {
      if (jobId) {
        await Promise.all([
          fetchJobPosition(),
          fetchJobApplications()
        ]);
      }
    };

    initializePage();
  }, [jobId, fetchJobApplications]);

  const getEmploymentTypeLabel = (type: string) => {
    const typeMap = {
      "FULL_TIME": "Full-time",
      "PART_TIME": "Part-time", 
      "INTERNSHIP": "Internship",
      "CONTRACT": "Contract",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const handleNavigateToApplication = () => {
    if (hasApplied) {
      toast.info("You have already applied for this position");
      return;
    }
    router.push(`/careers/${jobId}/apply`);
  };

  const handleShare = async (method: 'copy' | 'email') => {
    const url = window.location.href;
    const title = `Job Opportunity: ${jobPosition?.title}`;
    
    if (method === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.log(error);
        
        toast.error("Failed to copy link");
      }
    } else if (method === 'email') {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`Check out this job opportunity at YieldMind: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !jobPosition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            {error || "The job position you're looking for doesn't exist or is no longer available."}
          </p>
          <Link href="/careers">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Inactive job state
  if (!jobPosition.isActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Position Closed</h2>
          <p className="text-muted-foreground mb-8">
            This job position is no longer accepting applications.
          </p>
          <Link href="/careers">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-16 bg-card border-b border-primary/10">
        <div className="container-premium">
          <AnimatedSection>
            <div className="mb-6">
              <Link href="/careers">
                <Button className="hover:text-black" variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Careers
                </Button>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-3">
                  {jobPosition.department || 'General'}
                </Badge>
                {hasApplied && (
                  <Badge variant="default" className="ml-2 bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {jobPosition.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <span>{getEmploymentTypeLabel(jobPosition.employmentType)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{jobPosition.location || 'Location TBD'}</span>
                </div>
                {jobPosition.salaryRange && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    <span>{jobPosition.salaryRange}</span>
                  </div>
                )}
                {jobPosition.experienceRequired !== null && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{jobPosition.experienceRequired} years experience</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Posted {new Date(jobPosition.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{jobPosition.applications?.length || 0} applications</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleNavigateToApplication}
                disabled={hasApplied}
              >
                {hasApplied ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Application Submitted
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Apply for this Position
                  </>
                )}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Job Details */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FileText className="h-6 w-6" />
                      Job Description
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {jobPosition.description || 'No description provided for this position.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AnimatedSection delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Apply</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {hasApplied 
                        ? "You have successfully applied for this position." 
                        : "Ready to join our team? Submit your application now."
                      }
                    </p>
                    <Button 
                      className="w-full"
                      onClick={handleNavigateToApplication}
                      disabled={hasApplied}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Job Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                        <p className="text-sm font-semibold">{getEmploymentTypeLabel(jobPosition.employmentType)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <p className="text-sm font-semibold">{jobPosition.department || 'General'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-sm font-semibold">{jobPosition.location || 'Location TBD'}</p>
                      </div>
                      {jobPosition.salaryRange && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                          <p className="text-sm font-semibold">{jobPosition.salaryRange}</p>
                        </div>
                      )}
                      {jobPosition.experienceRequired !== null && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Experience Required</label>
                          <p className="text-sm font-semibold">{jobPosition.experienceRequired} years</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Share this Job</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Know someone who might be interested? Share this opportunity.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare('copy')}
                      >
                        Copy Link
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare('email')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
