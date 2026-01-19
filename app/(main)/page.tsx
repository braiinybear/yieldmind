import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVideoBackground } from "@/components/hero/HeroVideoBackground";
import { prisma } from "@/lib/db";
import { CourseCard } from "@/components/shared/CourseCard";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { StatsCounter } from "@/components/animations/StatsCounter";
import { TextReveal } from "@/components/animations/TextReveal";
import { ArrowRight, Award, Users, BookOpen, TrendingUp, Star, CheckCircle } from "lucide-react";

export default async function Home() {
  // Fetch top 3 featured courses
  const featuredCourses = await prisma.course.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      price: true,
      duration: true,
      type: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen">

      {/* ============================================
          HERO SECTION - Full Viewport, Premium
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid-premium">
        {/* Background Video */}
        <HeroVideoBackground />

        {/* Background Gradient Overlay - Handled inside HeroVideoBackground for better blending, but we can keep additional top-level overlays if needed. 
            For now, relying on component's overlay. */}


        {/* Animated Gold Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50 z-10" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50 z-10" />

        <div className="container-premium relative z-20 py-32">
          <div className="max-w-5xl mx-auto text-center space-y-16">

            {/* Badge */}
            <AnimatedSection>
              <div className="inline-block px-6 py-2 border border-primary/30 bg-primary/5 backdrop-blur-sm">
                <span className="text-primary font-accent font-semibold text-sm tracking-wider uppercase">
                  Admissions Open 2026
                </span>
              </div>
            </AnimatedSection>

            {/* Main Headline */}
            <TextReveal delay={0.2}>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                Master The Art of
                <span className="block text-gold-gradient mt-2">
                  Creative Excellence
                </span>
              </h1>
            </TextReveal>

            {/* Subheadline */}
            <AnimatedSection delay={0.4}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your passion into profession. Join India's premier creative technology institute.
              </p>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Link href="/courses">
                  <button className="btn-gold group">
                    Explore Courses
                    <ArrowRight className="inline-block ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/admissions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-2 border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary font-accent font-semibold uppercase tracking-wider"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Floating Stats Cards */}
            <AnimatedSection delay={0.8}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 max-w-4xl mx-auto">
                <div className="card-premium text-center">
                  <div className="stats-number">
                    <StatsCounter endValue={500} suffix="+" />
                  </div>
                  <p className="text-muted-foreground mt-2 font-accent text-sm uppercase tracking-wide">Students</p>
                </div>
                <div className="card-premium text-center">
                  <div className="stats-number">
                    <StatsCounter endValue={95} suffix="%" />
                  </div>
                  <p className="text-muted-foreground mt-2 font-accent text-sm uppercase tracking-wide">Placement</p>
                </div>
                <div className="card-premium text-center">
                  <div className="stats-number">
                    <StatsCounter endValue={12} suffix="+" />
                  </div>
                  <p className="text-muted-foreground mt-2 font-accent text-sm uppercase tracking-wide">Courses</p>
                </div>
                <div className="card-premium text-center">
                  <div className="stats-number">
                    <StatsCounter endValue={8} suffix="+" />
                  </div>
                  <p className="text-muted-foreground mt-2 font-accent text-sm uppercase tracking-wide">Years</p>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED COURSES SECTION
          ============================================ */}
      {featuredCourses.length > 0 && (
        <section className="section-padding bg-card/30 relative z-10">
          <div className="container-premium">

            <AnimatedSection>
              <div className="text-center mb-24">
                <div className="inline-block px-4 py-1 border border-primary/20 bg-primary/5 mb-8">
                  <span className="text-primary font-accent text-sm tracking-wider uppercase">Featured Programs</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8">
                  Start Your <span className="text-gold-gradient">Journey</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Industry-leading courses designed by experts, built for creators
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course, index) => (
                <AnimatedSection key={course.id} delay={index * 0.1}>
                  <CourseCard course={course} />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4}>
              <div className="text-center mt-16">
                <Link href="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-10 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary font-accent font-semibold uppercase tracking-wider"
                  >
                    View All Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

          </div>
        </section>
      )}

      {/* ============================================
          WHY CHOOSE US SECTION
          ============================================ */}
      <section className="section-padding bg-background relative z-10">
        <div className="container-premium">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left: Content */}
            <AnimatedSection>
              <div className="space-y-10">
                <div>
                  <div className="inline-block px-4 py-1 border border-primary/20 bg-primary/5 mb-6">
                    <span className="text-primary font-accent text-sm tracking-wider uppercase">Why YieldMind</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-8">
                    Excellence in <span className="text-gold-gradient">Education</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We don't just teach skills—we build careers. Our comprehensive approach ensures you're industry-ready from day one.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Award, title: "Industry-Certified Curriculum", desc: "Learn from real-world projects and case studies" },
                    { icon: Users, title: "Expert Mentorship", desc: "Direct guidance from industry professionals" },
                    { icon: TrendingUp, title: "Career Support", desc: "Placement assistance and portfolio building" },
                    { icon: Star, title: "Lifetime Access", desc: "Continuous learning with updated content" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 items-start group">
                      <div className="p-3 bg-primary/10 border border-primary/20 group-hover:bg-primary transition-colors">
                        <item.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Image/Visual */}
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="aspect-square bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 p-12 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <BookOpen className="h-32 w-32 text-primary mx-auto" />
                    <p className="text-2xl font-bold">Transforming Futures</p>
                    <p className="text-muted-foreground">Since 2016</p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary/30" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary/30" />
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION - Dark Background
          ============================================ */}
      <section className="section-padding bg-card relative z-10">
        <div className="container-premium">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Our <span className="text-gold-gradient">Impact</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Numbers that speak for themselves
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Students Trained" },
              { value: 95, suffix: "%", label: "Placement Rate" },
              { value: 50, suffix: "+", label: "Hiring Partners" },
              { value: 12, suffix: "+", label: "Industry Experts" }
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="text-center p-8 border border-primary/20 hover:border-primary transition-colors group">
                  <div className="stats-number mb-4">
                    <StatsCounter endValue={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-muted-foreground font-accent text-sm uppercase tracking-wide group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="section-padding bg-linear-to-br from-background via-primary/5 to-background relative overflow-hidden z-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-premium opacity-30 z-0" />

        <div className="container-premium relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold">
                Ready to <span className="text-gold-gradient">Transform</span> Your Career?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of successful students who've launched their creative careers with YieldMind Academy
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Link href="/register">
                  <button className="btn-gold group">
                    Start Your Journey
                    <ArrowRight className="inline-block ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <Link href="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary font-accent font-semibold uppercase tracking-wider"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}