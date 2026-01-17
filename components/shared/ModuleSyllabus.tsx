"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, FileText } from "lucide-react";

interface ModuleSyllabusProps {
    modules: any[];
}

export default function ModuleSyllabus({ modules }: ModuleSyllabusProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Course Curriculum</h3>
                <span className="text-muted-foreground font-accent text-sm uppercase tracking-wide">
                    {modules.length} Modules
                </span>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {modules.map((module) => (
                    <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="bg-card border border-primary/10 transition-all hover:border-primary/30"
                    >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                            <span className="flex items-center gap-4 text-left">
                                <span className="flex items-center justify-center w-8 h-8 rounded-none border border-primary/20 bg-primary/5 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {module.order + 1}
                                </span>
                                <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {module.title}
                                </span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                            <div className="pl-12 space-y-3">
                                {module.lessons?.map((lesson: any) => (
                                    <div key={lesson.id} className="flex items-center gap-3 text-muted-foreground pb-2 border-b border-border/50 last:border-0 last:pb-0">
                                        {lesson.type === 'video' ? <PlayCircle className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                                        <span>{lesson.title}</span>
                                        {lesson.isFree && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded ml-auto">Free Preview</span>}
                                    </div>
                                ))}
                                {(!module.lessons || module.lessons.length === 0) && (
                                    <div className="text-sm text-muted-foreground italic">No lessons available yet.</div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
