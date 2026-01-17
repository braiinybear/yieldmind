import { AnimatedSection } from "@/components/animations/AnimatedSection";

export default function PrivacyPolicyAsync() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-20 bg-card border-b border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">Privacy <span className="text-gold-gradient">Policy</span></h1>
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
                                At YieldMind Academy, we take your privacy seriously. This policy describes how we collect, use, and handle your personal information.
                            </p>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
                                <p className="text-muted-foreground">
                                    We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include your name, email address, payment information, and course progress data.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
                                <p className="text-muted-foreground">
                                    We use the information we collect to operate, maintain, and improve our services, including analyzing user behavior to provide personalized learning experiences and to communicate with you about your account and courses.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">3. Information Sharing</h2>
                                <p className="text-muted-foreground">
                                    We do not share your personal information with third parties except as described in this policy, such as with service providers who assist us in operating our platform (e.g., payment processors).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
                                <p className="text-muted-foreground">
                                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">5. Contact Us</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about this Privacy Policy, please contact us at privacy@yieldmind.academy.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
