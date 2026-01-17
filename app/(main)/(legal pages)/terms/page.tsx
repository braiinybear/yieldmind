import { AnimatedSection } from "@/components/animations/AnimatedSection";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-20 bg-card border-b border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">Terms of <span className="text-gold-gradient">Service</span></h1>
                            <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding relative z-10">
                <div className="container-premium max-w-4xl">
                    <AnimatedSection>
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Welcome to YieldMind Academy. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                            </p>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground">
                                    By registering for an account or enrolling in a course, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">2. User Accounts</h2>
                                <p className="text-muted-foreground">
                                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">3. Course Content & Intellectual Property</h2>
                                <p className="text-muted-foreground">
                                    All course content, including videos, text, and materials, is the property of YieldMind Academy and is protected by copyright laws. You are granted a limited, non-exclusive license to access the content for personal, non-commercial use only.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">4. Payment & Refunds</h2>
                                <p className="text-muted-foreground">
                                    Payments for courses are non-refundable unless otherwise stated in our Refund Policy. All prices are subject to change without notice.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">5. Limitation of Liability</h2>
                                <p className="text-muted-foreground">
                                    YieldMind Academy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
