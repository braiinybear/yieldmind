import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
    const jobs = [
        {
            title: "Senior Graphic Design Instructor",
            type: "Full-Time",
            location: "Dehradun, On-site",
            dept: "Academics"
        },
        {
            title: "Student Counselor",
            type: "Full-Time",
            location: "Dehradun, On-site",
            dept: "Admissions"
        },
        {
            title: "Web Development Mentor",
            type: "Part-Time / Contract",
            location: "Remote / Hybrid",
            dept: "Academics"
        }
    ];

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
                                <span className="text-primary font-accent text-sm tracking-wider uppercase">We're Hiring</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold">Join Our <span className="text-gold-gradient">Team</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Be part of a passionate team dedicated to shaping the future of creative education.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Open Positions */}
            <section className="section-padding relative z-10">
                <div className="container-premium">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold mb-12">Open Positions</h2>
                    </AnimatedSection>

                    <div className="grid gap-6">
                        {jobs.map((job, idx) => (
                            <AnimatedSection key={idx} delay={idx * 0.1}>
                                <div className="group border border-border bg-card p-6 md:p-8 hover:border-primary transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-3">
                                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">{job.dept}</span>
                                        <h3 className="text-2xl font-bold">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                <span>{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="outline" className="border-primary/50 hover:bg-primary hover:text-primary-foreground group-hover:border-primary">
                                            Apply Now
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.4}>
                        <div className="mt-16 p-8 md:p-12 bg-primary/5 border border-primary/20 text-center rounded-sm">
                            <h3 className="text-2xl font-bold mb-4">Don't see a suitable role?</h3>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                We are always looking for talented individuals. Send your resume and portfolio to careers@yieldmind.academy and we'll keep you in mind for future opportunities.
                            </p>
                            <Link href="mailto:careers@yieldmind.academy" className="text-primary font-semibold hover:underline">
                                Email Us Your Resume
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
