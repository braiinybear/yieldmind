import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-24 bg-card border-b border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-5xl md:text-6xl font-bold">Get in <span className="text-gold-gradient">Touch</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Have questions? We're here to help. Reach out to our admissions team or visit our campus.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <section className="section-padding relative z-10">
                <div className="container-premium">
                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* Contact Info */}
                        <AnimatedSection>
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-bold">Contact Information</h2>
                                    <p className="text-muted-foreground">Feel free to contact us via phone or email, or visit our campus during office hours.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="p-4 bg-primary/10 border border-primary/20 h-fit">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Campus Location</h3>
                                            <p className="text-muted-foreground">YieldMind Academy, Rajpur Road<br />Dehradun, Uttarakhand 248001</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="p-4 bg-primary/10 border border-primary/20 h-fit">
                                            <Phone className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Phone</h3>
                                            <p className="text-muted-foreground">+91 98765 43210</p>
                                            <p className="text-muted-foreground text-sm">Mon-Fri, 9am - 6pm</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="p-4 bg-primary/10 border border-primary/20 h-fit">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Email</h3>
                                            <p className="text-muted-foreground">info@yieldmind.academy</p>
                                            <p className="text-muted-foreground">admissions@yieldmind.academy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Contact Form */}
                        <AnimatedSection delay={0.2}>
                            <div className="bg-card border border-border p-8 md:p-10 shadow-lg">
                                <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
                                <form className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input placeholder="John" className="h-12 bg-background" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input placeholder="Doe" className="h-12 bg-background" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input type="email" placeholder="john@example.com" className="h-12 bg-background" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input placeholder="Course Inquiry" className="h-12 bg-background" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-background resize-none" />
                                    </div>

                                    <Button className="w-full h-12 text-lg font-accent font-semibold uppercase tracking-wider">
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </AnimatedSection>

                    </div>
                </div>
            </section>
        </div>
    );
}
