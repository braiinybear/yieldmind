"use client";

import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Send,
  CheckCircle,
  AlertCircle,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { JobPositionWithRelations } from "@/app/api/jobpositions/route";
import { useJobApplicationStore } from "@/zustand/root-store-provider";
import { CreateJobApplicationPayload } from "@/zustand/stores/admin-store/jobapplication-store";

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  
  // Job data state
  const [jobPosition, setJobPosition] = useState<JobPositionWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Application form state
  const [applicationData, setApplicationData] = useState<CreateJobApplicationPayload>({
    jobId: '',
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    skills: [],
    resumeUrl: '',
    coverLetter: ''
  });

  // Skills input as string for better UX
  const [skillsInput, setSkillsInput] = useState('');

  // Store access
  const { 
    createJobApplication, 
    loading: applicationLoading, 
    error: applicationError,
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
        setApplicationData(prev => ({ ...prev, jobId: data.data.id }));
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

  const handleInputChange = (field: keyof CreateJobApplicationPayload, value: string) => {
    if (field === 'skills') {
      setSkillsInput(value);
      // Update the skills array in applicationData
      const skillsArray = value.split(',').map(s => s.trim()).filter(s => s);
      setApplicationData(prev => ({
        ...prev,
        skills: skillsArray
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobPosition) {
      toast.error("Job position not found");
      return;
    }

    if (hasApplied) {
      toast.error("You have already applied for this position");
      return;
    }

    // Validate required fields
    const requiredFields = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      qualification: 'Qualification',
      experience: 'Experience',
      resumeUrl: 'Resume URL'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!applicationData[field as keyof CreateJobApplicationPayload]) {
        toast.error(`${label} is required`);
        return;
      }
    }

    if (applicationData.skills.length === 0) {
      toast.error("At least one skill is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate resume URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(applicationData.resumeUrl)) {
      toast.error("Please enter a valid URL for your resume");
      return;
    }

    try {
      await createJobApplication(applicationData);
      toast.success("Application submitted successfully!");
      router.push(`/careers/${jobId}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading job application form...</p>
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

  // Already applied state
  if (hasApplied) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Application Already Submitted</h2>
          <p className="text-muted-foreground mb-8">
            You have already applied for this position. We&apos;ll be in touch soon!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/careers/${jobId}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Job Details
              </Button>
            </Link>
            <Link href="/careers">
              <Button>
                View Other Positions
              </Button>
            </Link>
          </div>
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
              <Link href={`/careers/${jobId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Job Details
                </Button>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-3">
                  {jobPosition.department || 'General'}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Apply for {jobPosition.title}
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
              </div>

              <p className="text-lg text-muted-foreground">
                Complete the form below to submit your application. Make sure all required fields are filled accurately.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-8">Application Form</h2>

                  {applicationError && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                      <p className="text-sm text-destructive font-medium">{applicationError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmitApplication} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-foreground">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <Input
                          value={applicationData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-foreground">
                          Email <span className="text-primary">*</span>
                        </label>
                        <Input
                          type="email"
                          value={applicationData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-foreground">
                          Phone <span className="text-primary">*</span>
                        </label>
                        <Input
                          value={applicationData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 9876543210"
                          required
                          className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-foreground">
                          Qualification <span className="text-primary">*</span>
                        </label>
                        <Input
                          value={applicationData.qualification}
                          onChange={(e) => handleInputChange('qualification', e.target.value)}
                          placeholder="e.g., B.Tech Computer Science"
                          required
                          className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">
                        Experience <span className="text-primary">*</span>
                      </label>
                      <Input
                        value={applicationData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 2 years in software development"
                        required
                        className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe your relevant work experience
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">
                        Skills <span className="text-primary">*</span>
                      </label>
                      <Input
                        value={skillsInput}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        placeholder="React, Node.js, MongoDB, Python"
                        required
                        className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate skills with commas
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">
                        Resume URL <span className="text-primary">*</span>
                      </label>
                      <Input
                        type="url"
                        value={applicationData.resumeUrl}
                        onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                        placeholder="https://drive.google.com/file/d/your-resume-id"
                        required
                        className="h-12 border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                      />
                      <p className="text-xs text-muted-foreground">
                        Link to your resume (Google Drive, GitHub, or personal website)
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-foreground">Cover Letter</label>
                      <Textarea
                        value={applicationData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        rows={6}
                        className="resize-none min-h-[150px] border-border/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Share more about your motivation and fit for this role
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-6">
                      <Link href={`/careers/${jobId}`}>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={applicationLoading.create}
                          className="h-12 px-8 rounded-xl border-border/40 hover:bg-muted/50 transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        disabled={applicationLoading.create}
                        className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg flex items-center gap-2"
                      >
                        {applicationLoading.create ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}