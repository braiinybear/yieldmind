import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { StatsCounter } from "@/components/animations/StatsCounter";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <section className="relative py-24 bg-card border-b border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center max-w-4xl mx-auto space-y-8">
                            <div className="inline-block px-4 py-1 border border-primary/20 bg-primary/5">
                                <span className="text-primary font-accent text-sm tracking-wider uppercase">Our Story</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold">Empowering the Next Generation of <span className="text-gold-gradient">Creators</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                YieldMind Academy is India's premier institute for creative technology, dedicated to bridging the gap between artistic vision and technical mastery.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section-padding relative z-10">
                <div className="container-premium">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <AnimatedSection>
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold">Our <span className="text-gold-gradient">Mission</span></h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    To provide world-class education in graphic design, web development, and visual effects that effectively prepares students for the evolving demands of the creative industry. We believe in learning by doing, fostering innovation, and building a community of lifelong learners.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {["Industry-Standard Curriculum", "Expert Mentorship", "Career-Focused Training"].map((item) => (
                                        <li key={item} className="flex items-center gap-3">
                                            <CheckCircle className="h-6 w-6 text-primary" />
                                            <span className="font-semibold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={0.2}>
                            <div className="relative aspect-video bg-muted rounded-none border border-primary/20 overflow-hidden group">
                                {/* Placeholder for About Image */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-background flex items-center justify-center">
                                    <span className="text-muted-foreground font-accent uppercase tracking-widest">Team / Campus Image</span>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Philosophy Stats */}
            <section className="section-padding bg-card relative z-10 border-y border-primary/10">
                <div className="container-premium">
                    <AnimatedSection>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: 6, suffix: "+", label: "Years of Excellence" },
                                { value: 500, suffix: "+", label: "Graduates" },
                                { value: 50, suffix: "+", label: "Hiring Partners" },
                                { value: 100, suffix: "%", label: "Commitment" },
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="stats-number mb-2 text-primary">
                                        <StatsCounter endValue={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <p className="text-sm font-accent uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
