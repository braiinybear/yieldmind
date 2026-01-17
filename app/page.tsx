import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle, Palette, MonitorPlay, MousePointer2 } from "lucide-react";
import { WaveDivider } from "@/components/ui/wave-divider";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* --- HERO SECTION (Strict Semantic Theme) --- */}
      <section className="relative w-full py-12 overflow-hidden bg-background">
        {/* The Tech Grid Background - subtle opacity */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0 pointer-events-none" />

        {/* Floating Gradient Blob for 'Atmosphere' - using primary color */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full z-0" />

        <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">

            {/* Left: Text Content */}
            <div className="flex flex-col space-y-6 text-center lg:text-left">
              <Badge className="w-fit mx-auto lg:mx-0 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 px-4 py-1.5 text-sm ring-1 ring-primary/10">
                🚀 Admissions Open for 2026 Batch
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground drop-shadow-sm">
                Where <span className="text-primary">Creativity</span> <br />
                Meets Technology.
              </h1>

              <p className="max-w-[600px] mx-auto lg:mx-0 text-muted-foreground md:text-xl leading-relaxed">
                Join Dehradun's premier creative institute. Master <strong>Graphic Design, VFX, and Coding</strong> with an industry-grade curriculum.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg h-14 px-8 shadow-lg shadow-accent/20 transition-all hover:scale-105" asChild>
                  <Link href="/courses">
                    Start Learning
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-input text-foreground hover:bg-secondary" asChild>
                  <Link href="/admissions">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Dynamic "Card Stack" Image Layout */}
            <div className="relative mx-auto w-full max-w-[500px] aspect-square lg:aspect-auto lg:h-[500px]">
              {/* Decorative Circle */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-indigo-500/10 rounded-full blur-3xl opacity-60" />

              {/* Main Image Card */}
              <div className="relative z-20 rounded-2xl overflow-hidden border border-border shadow-2xl transform transition-transform hover:-translate-y-2 duration-500 bg-card">
                {/* Replace with real student image */}
                <div className="w-full h-[400px] bg-muted/50 flex items-center justify-center relative group">
                  <Palette className="h-24 w-24 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
                  <p className="absolute bottom-6 text-muted-foreground font-medium">Student Work Showcase</p>
                </div>
              </div>

              {/* Floating Element 1 - Clean Card */}
              <div className="absolute -bottom-6 -left-6 z-30 bg-card border border-border p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow ring-1 ring-border/50">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Placement Rate</p>
                  <p className="text-foreground font-bold">94% Hired</p>
                </div>
              </div>

              {/* Floating Element 2 - Clean Card */}
              <div className="absolute top-10 -right-10 z-10 bg-card border border-border p-4 rounded-xl shadow-xl hidden md:flex items-center gap-3 ring-1 ring-border/50">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MonitorPlay className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Live Batches</p>
                  <p className="text-foreground font-bold">Graphic & Web</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* The Wavy Divider at bottom */}
        <WaveDivider position="bottom" />
      </section>


      {/* --- "DISCOVER PROGRAMS" SECTION (Inspired by Image's Grid Cards) --- */}
      <section className="w-full py-24 bg-muted/30 relative">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">

          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
              Programs Designed for <span className="text-primary">Growth</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
              Practical learning that moves beyond theory. Pick your track.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Design */}
            <Card className="bg-card border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Palette className="h-24 w-24 text-primary" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Palette className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Graphic Design</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Master Photoshop, Illustrator, and Brand Identity. Create visuals that speak.
              </CardContent>
            </Card>

            {/* Card 2: Development */}
            <Card className="bg-card border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MousePointer2 className="h-24 w-24 text-muted-foreground" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MousePointer2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Web Development</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Build full-stack apps with Next.js, React, and Node. The future of code.
              </CardContent>
            </Card>

            {/* Card 3: Video */}
            <Card className="bg-card border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MonitorPlay className="h-24 w-24 text-accent" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-black transition-colors">
                  <MonitorPlay className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Video Editing</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Premiere Pro & After Effects. Tell compelling stories through motion.
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

    </div>
  );
}