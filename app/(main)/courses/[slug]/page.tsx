import { getCourseBySlug, getEnrollmentStatus } from "@/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import ModuleSyllabus from "@/components/shared/ModuleSyllabus";
import EnrollmentCard from "@/components/shared/EnrollmentCard";
import { auth } from "@/auth";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BarChart, Users, Globe, CheckCircle2 } from "lucide-react";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    // Resolve params properly
    const { slug } = await params;
    const course = await getCourseBySlug(slug);

    if (!course) {
        notFound();
    }

    const session = await auth();
    const enrollment = session?.user?.id
        ? await getEnrollmentStatus(course.id, session.user.id)
        : null;

    const isEnrolled = enrollment?.status === "ACTIVE" || enrollment?.status === "COMPLETED";

    return (
        <main className="min-h-screen bg-background">
            {/* Split Hero Section */}
            <section className="relative bg-[#050C16] border-b border-primary/10 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-grid-premium opacity-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="container-premium py-20 lg:py-28 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Content */}
                        <AnimatedSection>
                            <div className="space-y-8 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-1.5 border border-primary/20 bg-primary/10 text-primary uppercase text-xs font-bold tracking-widest">
                                        {course.type}
                                    </div>
                                    <div className="px-4 py-1.5 border border-gold-gradient/20 bg-gold-gradient/10 text-gold-gradient uppercase text-xs font-bold tracking-widest">
                                        {course.difficulty}
                                    </div>
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    {course.title}
                                </h1>

                                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                    {course.shortDescription || course.description}
                                </p>

                                <div className="flex flex-wrap gap-y-4 gap-x-8 text-sm font-accent text-white/80 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <span>{course.duration || "Self Paced"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BarChart className="h-5 w-5 text-primary" />
                                        <span>{course.difficulty}</span>
                                    </div>
                                    {course.venue && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-primary" />
                                            <span>{course.venue}</span>
                                        </div>
                                    )}
                                    {course.batchSize && (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            <span>Batch Size: {course.batchSize}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Right: Video/Image Preview */}
                        <AnimatedSection delay={0.2}>
                            <div className="relative aspect-video bg-black border border-primary/20 shadow-2xl overflow-hidden group">
                                {course.demoVideo ? (
                                    <>
                                        <video
                                            src={course.demoVideo}
                                            poster={course.thumbnail || "/placeholder-course.jpg"}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            src={course.thumbnail || "/placeholder-course.jpg"}
                                            alt={course.title}
                                            fill
                                            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform hover:bg-primary hover:text-primary-foreground backdrop-blur-sm">
                                                <div className="w-0 h-0 border-t-10 border-t-transparent border-l-20 border-l-current border-b-10 border-b-transparent ml-2" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding relative z-10">
                <div className="container-premium px-4">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Main Content Column */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview" className="w-full">
                                <AnimatedSection delay={0.3}>
                                    <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 mb-12 rounded-none h-auto">
                                        <TabsTrigger
                                            value="overview"
                                            className="rounded-none border-b-2 border-transparent px-8 py-4 font-accent text-lg uppercase tracking-wider data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all hover:text-primary/70"
                                        >
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="curriculum"
                                            className="rounded-none border-b-2 border-transparent px-8 py-4 font-accent text-lg uppercase tracking-wider data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all hover:text-primary/70"
                                        >
                                            Curriculum
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="instructor"
                                            className="rounded-none border-b-2 border-transparent px-8 py-4 font-accent text-lg uppercase tracking-wider data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all hover:text-primary/70"
                                        >
                                            Instructor
                                        </TabsTrigger>
                                    </TabsList>
                                </AnimatedSection>

                                <TabsContent value="overview" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <AnimatedSection>
                                        <h3 className="text-3xl font-bold mb-6">Course Description</h3>
                                        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                            <p>{course.description}</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                                            <div className="bg-card p-8 border border-primary/10 hover:border-primary/30 transition-colors">
                                                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-primary inline-block mr-2"></span>
                                                    What You'll Learn
                                                </h4>
                                                <ul className="space-y-3">
                                                    {course.information?.learningOutcomes && course.information.learningOutcomes.length > 0 ? (
                                                        course.information.learningOutcomes.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        [
                                                            "Master core concepts and principles",
                                                            "Build real-world projects",
                                                            "Industry-standard workflows",
                                                            "Professional certification"
                                                        ].map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>

                                            <div className="bg-card p-8 border border-primary/10 hover:border-primary/30 transition-colors">
                                                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-primary inline-block mr-2"></span>
                                                    Requirements
                                                </h4>
                                                <ul className="space-y-3">
                                                    {course.information?.requirements && course.information.requirements.length > 0 ? (
                                                        course.information.requirements.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                                <span className="text-primary mt-1 font-bold">•</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        [
                                                            "Basic computer knowledge",
                                                            "Passion for learning",
                                                            "No prior experience needed"
                                                        ].map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                                <span className="text-primary mt-1 font-bold">•</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* What's Included Section */}
                                        {course.information?.includes && course.information.includes.length > 0 && (
                                            <div className="bg-card p-8 border border-primary/10 hover:border-primary/30 transition-colors mt-8">
                                                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-primary inline-block mr-2"></span>
                                                    What's Included
                                                </h4>
                                                <ul className="grid md:grid-cols-2 gap-3">
                                                    {course.information.includes.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </AnimatedSection>
                                </TabsContent>

                                <TabsContent value="curriculum" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <AnimatedSection>
                                        <ModuleSyllabus modules={course.modules} />
                                    </AnimatedSection>
                                </TabsContent>

                                <TabsContent value="instructor" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <AnimatedSection>
                                        <div className="flex flex-col md:flex-row items-start gap-8 bg-card p-10 border border-primary/10">
                                            <div className="w-32 h-32 bg-muted relative shrink-0 border-2 border-primary/20 overflow-hidden">
                                                {/* Instructor Image Placeholder */}
                                                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-background flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-primary">
                                                        {course.instructorName ? course.instructorName.substring(0, 2).toUpperCase() : 'YM'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">
                                                    {course.instructorName || 'YieldMind Expert'}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {course.instructorBio || 'Our courses are taught by industry veterans with over 10 years of experience in the field. They have worked with top global brands and bring real-world insights into the classroom.'}
                                                </p>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <AnimatedSection delay={0.4}>
                                <EnrollmentCard course={course} enrollment={enrollment} />
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    );
}
