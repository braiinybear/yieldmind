import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQsPage() {
    const faqs = [
        {
            question: "What courses do you offer?",
            answer: "We offer professional courses in Graphic Design, Web Development, Video Editing, 3D Animation, and Visual Effects (VFX). Each course is designed to meet industry standards."
        },
        {
            question: "Do you provide job placement assistance?",
            answer: "Yes, we have a dedicated placement cell that helps students with portfolio building, interview preparation, and connecting with our network of hiring partners."
        },
        {
            question: "What is the duration of the courses?",
            answer: "Course duration varies from 3 months (short-term certification) to 12 months (diploma programs), depending on the depth and specialization you choose."
        },
        {
            question: "Can I take the courses online?",
            answer: "Yes, we offer both online and offline (classroom) learning options. Our online classes are live and interactive, ensuring you get the same quality of mentorship."
        },
        {
            question: "Who are the instructors?",
            answer: "Our instructors are industry professionals with years of experience working in top design studios, agencies, and tech companies."
        },
        {
            question: "Do I need prior experience?",
            answer: "Most of our foundation courses are beginner-friendly and do not require prior experience. Advanced courses may have some prerequisites."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-20 bg-card border-b border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-premium opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
                <div className="container-premium relative z-20">
                    <AnimatedSection>
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked <span className="text-gold-gradient">Questions</span></h1>
                            <p className="text-muted-foreground text-lg">Find answers to common questions about our programs and admissions.</p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* FAQs */}
            <section className="section-padding relative z-10">
                <div className="container-premium max-w-3xl">
                    <AnimatedSection>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border border-border bg-card px-6">
                                    <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:text-primary transition-colors py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AnimatedSection>
                </div>
            </section>

            {/* Still have questions? */}
            <section className="py-20 bg-card border-t border-primary/10 relative z-10">
                <div className="container-premium text-center">
                    <AnimatedSection>
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                            <HelpCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-muted-foreground mb-8">Can't find the answer you're looking for? Please contact our support team.</p>
                        <a href="/contact" className="btn-gold inline-block px-8 py-3">Contact Us</a>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
