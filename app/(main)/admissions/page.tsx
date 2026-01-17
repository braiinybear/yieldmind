import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
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
                                <span className="text-primary font-accent text-sm tracking-wider uppercase">Join Us</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold">Start Your <span className="text-gold-gradient">Journey</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Admissions for the 2026 academic year are now open. Secure your spot in our industry-leading programs.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Process Steps */}
            <section className="section-padding relative z-10">
                <div className="container-premium">
                    <AnimatedSection>
                        <h2 className="text-4xl font-bold text-center mb-16">Admission <span className="text-gold-gradient">Process</span></h2>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

                        {[
                            { icon: FileText, title: "1. Apply Online", desc: "Fill out the online application form with your details and course preference." },
                            { icon: Calendar, title: "2. Counseling", desc: "Schedule a free counseling session with our academic advisors." },
                            { icon: CheckCircle, title: "3. Enrollment", desc: "Complete the enrollment formalities and secure your seat." }
                        ].map((step, idx) => (
                            <AnimatedSection key={idx} delay={idx * 0.2}>
                                <div className="bg-background pt-4 md:pt-0 relative">
                                    <div className="w-24 h-24 mx-auto bg-card border border-primary/20 flex items-center justify-center mb-6 shadow-lg">
                                        <step.icon className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="text-center space-y-4 px-4">
                                        <h3 className="text-2xl font-bold">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.6}>
                        <div className="text-center mt-20">
                            <Link href="/register">
                                <button className="btn-gold text-lg px-10 py-4">
                                    Apply Now
                                </button>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="section-padding bg-card relative z-10 border-t border-primary/10">
                <div className="container-premium max-w-4xl">
                    <AnimatedSection>
                        <h2 className="text-3xl font-bold mb-8">Eligibility Requirements</h2>
                        <div className="space-y-6">
                            <div className="p-6 border border-border bg-background">
                                <h3 className="text-xl font-semibold mb-2">Academic Qualification</h3>
                                <p className="text-muted-foreground">Minimum 10+2 (High School) from a recognized board or equivalent.</p>
                            </div>
                            <div className="p-6 border border-border bg-background">
                                <h3 className="text-xl font-semibold mb-2">Tech Requirements</h3>
                                <p className="text-muted-foreground">Basic familiarity with computers. Access to a laptop/PC is recommended for practice.</p>
                            </div>
                            <div className="p-6 border border-border bg-background">
                                <h3 className="text-xl font-semibold mb-2">Age Limit</h3>
                                <p className="text-muted-foreground">Minimum 16 years of age at the time of admission. No upper age limit.</p>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
